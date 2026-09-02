create extension if not exists pgcrypto;

create table if not exists public.rb_pro_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash bytea not null unique,
  label text null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_used_at timestamptz null,
  disabled_at timestamptz null
);

create table if not exists public.rb_pro_sessions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.rb_pro_codes(id) on delete cascade,
  token_hash bytea not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_used_at timestamptz null,
  revoked_at timestamptz null
);

create index if not exists rb_pro_sessions_code_id_idx on public.rb_pro_sessions(code_id);
create index if not exists rb_pro_sessions_expires_at_idx on public.rb_pro_sessions(expires_at);

alter table public.rb_pro_codes enable row level security;
alter table public.rb_pro_sessions enable row level security;
revoke all on public.rb_pro_codes from anon, authenticated;
revoke all on public.rb_pro_sessions from anon, authenticated;

create or replace function public.rb_pro_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false); $$;

create or replace function public.rb_pro_normalize_code(p_code text)
returns text
language sql
immutable
as $$ select regexp_replace(upper(coalesce(p_code, '')), '[^A-Z0-9]', '', 'g'); $$;

create or replace function public.rb_pro_authorized(p_token text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if public.rb_pro_is_admin() then return true; end if;
  if coalesce(length(p_token), 0) < 32 then return false; end if;
  return exists (
    select 1 from public.rb_pro_sessions s
    join public.rb_pro_codes c on c.id = s.code_id
    where s.token_hash = digest(p_token, 'sha256')
      and s.revoked_at is null and s.expires_at > now() and c.active = true
  );
end;
$$;

create or replace function public.rb_pro_login(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_code public.rb_pro_codes%rowtype;
  v_token text;
  v_expires timestamptz := now() + interval '90 days';
  v_normalized text := public.rb_pro_normalize_code(p_code);
begin
  if length(v_normalized) < 12 then raise exception 'RB_PRO_INVALID_CODE' using errcode = '22023'; end if;
  select * into v_code from public.rb_pro_codes where code_hash = digest(v_normalized, 'sha256') and active = true limit 1;
  if v_code.id is null then raise exception 'RB_PRO_INVALID_CODE' using errcode = '22023'; end if;
  v_token := encode(gen_random_bytes(32), 'hex');
  insert into public.rb_pro_sessions(code_id, token_hash, expires_at, last_used_at)
  values (v_code.id, digest(v_token, 'sha256'), v_expires, now());
  update public.rb_pro_codes set last_used_at = now() where id = v_code.id;
  return jsonb_build_object('token', v_token, 'expires_at', v_expires);
end;
$$;

create or replace function public.rb_pro_check_access(p_token text default null)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$ select public.rb_pro_authorized(p_token); $$;

create or replace function public.rb_pro_orders_list(p_token text default null, p_from integer default 0, p_to integer default 11)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_from integer := greatest(coalesce(p_from, 0), 0);
  v_to integer := greatest(coalesce(p_to, 11), greatest(coalesce(p_from, 0), 0));
  v_limit integer;
  v_total bigint;
  v_items jsonb;
begin
  if not public.rb_pro_authorized(p_token) then raise exception 'RB_PRO_ACCESS_REQUIRED' using errcode = '42501'; end if;
  v_limit := least(v_to - v_from + 1, 50);
  select count(*) into v_total from public.published_orders_list;
  select coalesce(jsonb_agg(to_jsonb(q)), '[]'::jsonb) into v_items
  from (
    select id, number, title, location, description, preferred_deadline, contractor_payment, cover_path, works_count, created_at, updated_at
    from public.published_orders_list
    order by updated_at desc, id desc
    offset v_from limit v_limit
  ) q;
  if not public.rb_pro_is_admin() and coalesce(length(p_token), 0) >= 32 then
    update public.rb_pro_sessions set last_used_at = now()
    where token_hash = digest(p_token, 'sha256') and revoked_at is null;
  end if;
  return jsonb_build_object('items', v_items, 'has_more', (v_from + jsonb_array_length(v_items)) < v_total);
end;
$$;

create or replace function public.rb_pro_order_detail(p_order_id text, p_token text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare v_order jsonb;
begin
  if not public.rb_pro_authorized(p_token) then raise exception 'RB_PRO_ACCESS_REQUIRED' using errcode = '42501'; end if;
  select to_jsonb(o) into v_order from public.published_orders o where o.id = p_order_id limit 1;
  if not public.rb_pro_is_admin() and coalesce(length(p_token), 0) >= 32 then
    update public.rb_pro_sessions set last_used_at = now()
    where token_hash = digest(p_token, 'sha256') and revoked_at is null;
  end if;
  return v_order;
end;
$$;

create or replace function public.rb_pro_create_code(p_label text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_raw text;
  v_normalized text;
  v_id uuid;
begin
  if not public.rb_pro_is_admin() then raise exception 'ADMIN_REQUIRED' using errcode = '42501'; end if;
  loop
    v_normalized := 'RB' || upper(encode(gen_random_bytes(8), 'hex'));
    exit when not exists (select 1 from public.rb_pro_codes where code_hash = digest(v_normalized, 'sha256'));
  end loop;
  v_raw := 'RB-' || substr(v_normalized, 3, 4) || '-' || substr(v_normalized, 7, 4) || '-' || substr(v_normalized, 11, 4) || '-' || substr(v_normalized, 15, 4);
  insert into public.rb_pro_codes(code_hash, label)
  values (digest(v_normalized, 'sha256'), nullif(trim(p_label), '')) returning id into v_id;
  return jsonb_build_object('id', v_id, 'code', v_raw, 'label', nullif(trim(p_label), ''));
end;
$$;

create or replace function public.rb_pro_list_codes()
returns table(id uuid, label text, active boolean, created_at timestamptz, last_used_at timestamptz, disabled_at timestamptz, active_sessions bigint)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.rb_pro_is_admin() then raise exception 'ADMIN_REQUIRED' using errcode = '42501'; end if;
  return query
  select c.id, c.label, c.active, c.created_at, c.last_used_at, c.disabled_at,
         count(s.id) filter (where s.revoked_at is null and s.expires_at > now())::bigint
  from public.rb_pro_codes c left join public.rb_pro_sessions s on s.code_id = c.id
  group by c.id order by c.created_at desc;
end;
$$;

create or replace function public.rb_pro_set_code_active(p_code_id uuid, p_active boolean)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.rb_pro_is_admin() then raise exception 'ADMIN_REQUIRED' using errcode = '42501'; end if;
  update public.rb_pro_codes set active = p_active, disabled_at = case when p_active then null else now() end where id = p_code_id;
  if not p_active then update public.rb_pro_sessions set revoked_at = coalesce(revoked_at, now()) where code_id = p_code_id; end if;
  return found;
end;
$$;

revoke all on function public.rb_pro_is_admin() from public, anon, authenticated;
revoke all on function public.rb_pro_normalize_code(text) from public;
revoke all on function public.rb_pro_authorized(text) from public, anon, authenticated;
revoke all on function public.rb_pro_login(text) from public;
grant execute on function public.rb_pro_login(text) to anon, authenticated;
revoke all on function public.rb_pro_check_access(text) from public;
grant execute on function public.rb_pro_check_access(text) to anon, authenticated;
revoke all on function public.rb_pro_orders_list(text, integer, integer) from public;
grant execute on function public.rb_pro_orders_list(text, integer, integer) to anon, authenticated;
revoke all on function public.rb_pro_order_detail(text, text) from public;
grant execute on function public.rb_pro_order_detail(text, text) to anon, authenticated;
revoke all on function public.rb_pro_create_code(text) from public;
grant execute on function public.rb_pro_create_code(text) to authenticated;
revoke all on function public.rb_pro_list_codes() from public;
grant execute on function public.rb_pro_list_codes() to authenticated;
revoke all on function public.rb_pro_set_code_active(uuid, boolean) from public;
grant execute on function public.rb_pro_set_code_active(uuid, boolean) to authenticated;

revoke all on public.published_orders from anon, authenticated;
revoke all on public.published_orders_list from anon, authenticated;

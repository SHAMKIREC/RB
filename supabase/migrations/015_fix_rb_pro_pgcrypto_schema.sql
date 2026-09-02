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
    where s.token_hash = extensions.digest(p_token, 'sha256')
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
  select * into v_code from public.rb_pro_codes where code_hash = extensions.digest(v_normalized, 'sha256') and active = true limit 1;
  if v_code.id is null then raise exception 'RB_PRO_INVALID_CODE' using errcode = '22023'; end if;
  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.rb_pro_sessions(code_id, token_hash, expires_at, last_used_at)
  values (v_code.id, extensions.digest(v_token, 'sha256'), v_expires, now());
  update public.rb_pro_codes set last_used_at = now() where id = v_code.id;
  return jsonb_build_object('token', v_token, 'expires_at', v_expires);
end;
$$;

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
    where token_hash = extensions.digest(p_token, 'sha256') and revoked_at is null;
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
    where token_hash = extensions.digest(p_token, 'sha256') and revoked_at is null;
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
    v_normalized := 'RB' || upper(encode(extensions.gen_random_bytes(8), 'hex'));
    exit when not exists (select 1 from public.rb_pro_codes where code_hash = extensions.digest(v_normalized, 'sha256'));
  end loop;
  v_raw := 'RB-' || substr(v_normalized, 3, 4) || '-' || substr(v_normalized, 7, 4) || '-' || substr(v_normalized, 11, 4) || '-' || substr(v_normalized, 15, 4);
  insert into public.rb_pro_codes(code_hash, label)
  values (extensions.digest(v_normalized, 'sha256'), nullif(trim(p_label), '')) returning id into v_id;
  return jsonb_build_object('id', v_id, 'code', v_raw, 'label', nullif(trim(p_label), ''));
end;
$$;

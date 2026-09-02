create sequence if not exists public.rb_pro_master_number_seq;

alter table public.rb_pro_codes
  add column if not exists master_number bigint;

with numbered as (
  select id, row_number() over (order by created_at asc, id asc) as rn
  from public.rb_pro_codes
  where master_number is null
), base as (
  select coalesce(max(master_number), 0) as max_no from public.rb_pro_codes
)
update public.rb_pro_codes c
set master_number = base.max_no + numbered.rn
from numbered, base
where c.id = numbered.id;

select setval('public.rb_pro_master_number_seq', greatest(coalesce((select max(master_number) from public.rb_pro_codes), 0) + 1, 1), false);

alter table public.rb_pro_codes
  alter column master_number set default nextval('public.rb_pro_master_number_seq'),
  alter column master_number set not null;

create unique index if not exists rb_pro_codes_master_number_key on public.rb_pro_codes(master_number);

drop function if exists public.rb_pro_list_codes();
create function public.rb_pro_list_codes()
returns table(
  id uuid,
  master_number bigint,
  label text,
  active boolean,
  created_at timestamptz,
  last_used_at timestamptz,
  disabled_at timestamptz,
  active_sessions bigint
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.rb_pro_is_admin() then
    raise exception 'ADMIN_REQUIRED' using errcode = '42501';
  end if;

  return query
  select c.id, c.master_number, c.label, c.active, c.created_at, c.last_used_at, c.disabled_at,
         count(s.id) filter (where s.revoked_at is null and s.expires_at > now())::bigint
  from public.rb_pro_codes c
  left join public.rb_pro_sessions s on s.code_id = c.id
  group by c.id, c.master_number
  order by c.master_number desc;
end;
$$;

revoke all on function public.rb_pro_list_codes() from public, anon;
grant execute on function public.rb_pro_list_codes() to authenticated;

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
  v_master_number bigint;
begin
  if not public.rb_pro_is_admin() then raise exception 'ADMIN_REQUIRED' using errcode = '42501'; end if;
  loop
    v_normalized := 'RB' || upper(encode(extensions.gen_random_bytes(8), 'hex'));
    exit when not exists (select 1 from public.rb_pro_codes where code_hash = extensions.digest(v_normalized, 'sha256'));
  end loop;
  v_raw := 'RB-' || substr(v_normalized, 3, 4) || '-' || substr(v_normalized, 7, 4) || '-' || substr(v_normalized, 11, 4) || '-' || substr(v_normalized, 15, 4);
  insert into public.rb_pro_codes(code_hash, label)
  values (extensions.digest(v_normalized, 'sha256'), nullif(trim(p_label), ''))
  returning id, master_number into v_id, v_master_number;
  return jsonb_build_object('id', v_id, 'code', v_raw, 'master_number', v_master_number, 'label', nullif(trim(p_label), ''));
end;
$$;

revoke all on function public.rb_pro_create_code(text) from public, anon;
grant execute on function public.rb_pro_create_code(text) to authenticated;

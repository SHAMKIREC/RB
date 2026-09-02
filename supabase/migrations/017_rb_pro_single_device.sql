-- RB PRO: strictly one active device/session per master code.

update public.rb_pro_sessions
set revoked_at = coalesce(revoked_at, now())
where revoked_at is null and expires_at <= now();

with ranked as (
  select id,
         row_number() over (partition by code_id order by created_at desc, id desc) as rn
  from public.rb_pro_sessions
  where revoked_at is null and expires_at > now()
)
update public.rb_pro_sessions s
set revoked_at = now()
from ranked r
where s.id = r.id and r.rn > 1;

create unique index if not exists rb_pro_one_live_session_per_code_idx
  on public.rb_pro_sessions(code_id)
  where revoked_at is null;

create or replace function public.rb_pro_login(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
declare
  v_code public.rb_pro_codes%rowtype;
  v_token text;
  v_expires timestamptz := now() + interval '90 days';
  v_normalized text := public.rb_pro_normalize_code(p_code);
begin
  if length(v_normalized) < 12 then
    raise exception 'RB_PRO_INVALID_CODE' using errcode = '22023';
  end if;

  select * into v_code
  from public.rb_pro_codes
  where code_hash = extensions.digest(v_normalized, 'sha256') and active = true
  limit 1;

  if v_code.id is null then
    raise exception 'RB_PRO_INVALID_CODE' using errcode = '22023';
  end if;

  update public.rb_pro_sessions
  set revoked_at = coalesce(revoked_at, now())
  where code_id = v_code.id and revoked_at is null and expires_at <= now();

  if exists (
    select 1 from public.rb_pro_sessions
    where code_id = v_code.id and revoked_at is null and expires_at > now()
  ) then
    raise exception 'RB_PRO_DEVICE_ALREADY_BOUND' using errcode = '23505';
  end if;

  v_token := encode(extensions.gen_random_bytes(32), 'hex');

  begin
    insert into public.rb_pro_sessions(code_id, token_hash, expires_at, last_used_at)
    values (v_code.id, extensions.digest(v_token, 'sha256'), v_expires, now());
  exception when unique_violation then
    raise exception 'RB_PRO_DEVICE_ALREADY_BOUND' using errcode = '23505';
  end;

  update public.rb_pro_codes set last_used_at = now() where id = v_code.id;
  return jsonb_build_object('token', v_token, 'expires_at', v_expires);
end;
$$;

create or replace function public.rb_pro_reset_device(p_code_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
declare
  v_exists boolean;
begin
  if not public.rb_pro_is_admin() then
    raise exception 'ADMIN_REQUIRED' using errcode = '42501';
  end if;

  select exists(select 1 from public.rb_pro_codes where id = p_code_id) into v_exists;
  if not v_exists then return false; end if;

  update public.rb_pro_sessions
  set revoked_at = coalesce(revoked_at, now())
  where code_id = p_code_id and revoked_at is null;

  return true;
end;
$$;

revoke all on function public.rb_pro_reset_device(uuid) from public, anon;
grant execute on function public.rb_pro_reset_device(uuid) to authenticated;

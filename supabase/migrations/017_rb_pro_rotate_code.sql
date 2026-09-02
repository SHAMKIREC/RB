create or replace function public.rb_pro_rotate_code(p_code_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_raw text;
  v_normalized text;
  v_label text;
  v_master_number bigint;
begin
  if not public.rb_pro_is_admin() then
    raise exception 'ADMIN_REQUIRED' using errcode = '42501';
  end if;

  select label, master_number into v_label, v_master_number
  from public.rb_pro_codes
  where id = p_code_id
  for update;

  if not found then
    raise exception 'RB_PRO_CODE_NOT_FOUND' using errcode = 'P0002';
  end if;

  loop
    v_normalized := 'RB' || upper(encode(extensions.gen_random_bytes(8), 'hex'));
    exit when not exists (
      select 1 from public.rb_pro_codes
      where code_hash = extensions.digest(v_normalized, 'sha256')
    );
  end loop;

  v_raw := 'RB-' || substr(v_normalized, 3, 4) || '-' || substr(v_normalized, 7, 4) || '-' || substr(v_normalized, 11, 4) || '-' || substr(v_normalized, 15, 4);

  update public.rb_pro_codes
  set code_hash = extensions.digest(v_normalized, 'sha256'),
      active = true,
      disabled_at = null,
      last_used_at = null
  where id = p_code_id;

  update public.rb_pro_sessions
  set revoked_at = coalesce(revoked_at, now())
  where code_id = p_code_id and revoked_at is null;

  return jsonb_build_object(
    'id', p_code_id,
    'code', v_raw,
    'label', v_label,
    'master_number', v_master_number
  );
end;
$$;

revoke all on function public.rb_pro_rotate_code(uuid) from public, anon;
grant execute on function public.rb_pro_rotate_code(uuid) to authenticated;

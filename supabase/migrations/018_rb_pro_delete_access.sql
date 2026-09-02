create or replace function public.rb_pro_delete_code(p_code_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role','') <> 'admin' then
    raise exception 'ADMIN_REQUIRED';
  end if;
  delete from public.rb_pro_codes where id = p_code_id;
  return found;
end;
$$;
revoke all on function public.rb_pro_delete_code(uuid) from public, anon;
grant execute on function public.rb_pro_delete_code(uuid) to authenticated;

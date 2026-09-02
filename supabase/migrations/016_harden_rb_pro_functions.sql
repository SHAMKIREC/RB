create or replace function public.rb_pro_normalize_code(p_code text)
returns text
language sql
immutable
set search_path = pg_catalog, pg_temp
as $$
  select regexp_replace(upper(coalesce(p_code, '')), '[^A-Z0-9]', '', 'g');
$$;

revoke execute on function public.rb_pro_create_code(text) from public, anon;
revoke execute on function public.rb_pro_list_codes() from public, anon;
revoke execute on function public.rb_pro_set_code_active(uuid, boolean) from public, anon;

grant execute on function public.rb_pro_create_code(text) to authenticated;
grant execute on function public.rb_pro_list_codes() to authenticated;
grant execute on function public.rb_pro_set_code_active(uuid, boolean) to authenticated;

revoke execute on function public.rb_pro_is_admin() from public, anon, authenticated;
revoke execute on function public.rb_pro_authorized(text) from public, anon, authenticated;
revoke execute on function public.rb_pro_normalize_code(text) from public, anon, authenticated;

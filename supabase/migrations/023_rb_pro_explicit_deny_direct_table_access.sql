begin;

drop policy if exists "deny direct access rb pro codes" on public.rb_pro_codes;
create policy "deny direct access rb pro codes"
on public.rb_pro_codes
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists "deny direct access rb pro sessions" on public.rb_pro_sessions;
create policy "deny direct access rb pro sessions"
on public.rb_pro_sessions
for all
to anon, authenticated
using (false)
with check (false);

commit;

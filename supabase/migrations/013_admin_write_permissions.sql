begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.orders enable row level security;
alter table public.order_works enable row level security;
alter table public.projects enable row level security;
alter table public.project_works enable row level security;
alter table public.project_media enable row level security;
alter table public.project_documents enable row level security;

-- Never permit public/publishable-key clients to mutate owner data.
revoke insert, update, delete on table public.orders from anon;
revoke insert, update, delete on table public.order_works from anon;
revoke insert, update, delete on table public.projects from anon;
revoke insert, update, delete on table public.project_works from anon;
revoke insert, update, delete on table public.project_media from anon;
revoke insert, update, delete on table public.project_documents from anon;

-- Authenticated users still pass RLS, so only app_metadata.role=admin can write.
grant select, insert, update, delete on table public.orders to authenticated;
grant select, insert, update, delete on table public.order_works to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.project_works to authenticated;
grant select, insert, update, delete on table public.project_media to authenticated;
grant select, insert, update, delete on table public.project_documents to authenticated;
grant usage, select on all sequences in schema public to authenticated;

drop policy if exists "admins manage orders" on public.orders;
drop policy if exists "admins manage order works" on public.order_works;
drop policy if exists "admins manage projects" on public.projects;
drop policy if exists "admins manage project works" on public.project_works;
drop policy if exists "admins manage project media" on public.project_media;
drop policy if exists "admins manage project documents" on public.project_documents;

create policy "admins manage orders" on public.orders
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order works" on public.order_works
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage projects" on public.projects
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage project works" on public.project_works
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage project media" on public.project_media
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage project documents" on public.project_documents
for all to authenticated using (public.is_admin()) with check (public.is_admin());

commit;

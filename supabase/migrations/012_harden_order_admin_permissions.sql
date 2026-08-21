begin;

-- Reassert the owner/admin access model for orders without ever granting writes
-- to anonymous visitors. This migration is intentionally idempotent so it can
-- repair projects where earlier grants or policies were only partially applied.

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

drop policy if exists "admins manage orders" on public.orders;
drop policy if exists "admins manage order works" on public.order_works;

create policy "admins manage orders" on public.orders
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage order works" on public.order_works
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Anonymous users may never create, change or delete orders directly.
revoke insert, update, delete, truncate, references, trigger on table public.orders from anon;
revoke insert, update, delete, truncate, references, trigger on table public.order_works from anon;

-- The signed-in owner needs normal CRUD access. RLS above still requires the
-- JWT app_metadata.role to equal "admin".
grant select, insert, update, delete on table public.orders to authenticated;
grant select, insert, update, delete on table public.order_works to authenticated;
grant usage, select on all sequences in schema public to authenticated;

commit;

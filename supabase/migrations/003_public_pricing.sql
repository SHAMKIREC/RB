begin;

drop policy if exists "public reads pricing overrides" on public.pricing_overrides;

create policy "public reads pricing overrides"
on public.pricing_overrides
for select
to anon, authenticated
using (true);

grant select (scope, item_id, price) on public.pricing_overrides to anon;

commit;

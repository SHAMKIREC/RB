begin;

-- One role check is used by table and Storage policies. The role must be set in
-- auth.users.raw_app_meta_data and is exposed in the JWT as app_metadata.role.
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
alter table public.reviews enable row level security;
alter table public.pricing_overrides enable row level security;

-- This SECURITY DEFINER helper is deliberately narrow: it only answers whether
-- a UUID belongs to an empty, unpublished pending review. It lets Storage RLS
-- validate an anonymous upload without granting anon SELECT on pending reviews.
create or replace function public.can_upload_pending_review_photo(review_id text)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.reviews r
    where r.id = review_id
      and r.status = 'pending'
      and not r.is_published
      and r.photos = '[]'::jsonb
  );
$$;

revoke all on function public.can_upload_pending_review_photo(text) from public;
grant execute on function public.can_upload_pending_review_photo(text) to anon;

-- Recreate all write policies so old deployments and partially applied
-- migrations converge to one known policy set.
drop policy if exists "admins manage orders" on public.orders;
drop policy if exists "admins manage order works" on public.order_works;
drop policy if exists "admins manage projects" on public.projects;
drop policy if exists "admins manage project works" on public.project_works;
drop policy if exists "admins manage project media" on public.project_media;
drop policy if exists "admins manage project documents" on public.project_documents;
drop policy if exists "admins manage reviews" on public.reviews;
drop policy if exists "admins manage pricing" on public.pricing_overrides;
drop policy if exists "anon submits pending reviews" on public.reviews;

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
create policy "admins manage reviews" on public.reviews
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage pricing" on public.pricing_overrides
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anon submits pending reviews" on public.reviews
for insert to anon
with check (
  status = 'pending'
  and not is_published
  and not is_demo
  and consent
  and photos = '[]'::jsonb
  and char_length(btrim(client_name)) between 1 and 120
  and char_length(btrim(location)) between 1 and 240
  and char_length(btrim(service_title)) between 1 and 240
  and char_length(btrim(review_text)) between 1 and 5000
  and char_length(contact) <= 500
);

grant all on table public.orders, public.order_works, public.projects,
  public.project_works, public.project_media, public.project_documents,
  public.reviews, public.pricing_overrides to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant insert (id, client_name, location, service_title, review_text, rating,
  photos, order_number, contact, consent) on public.reviews to anon;

-- Public pricing must be readable on every device, while writes remain admin-only.
drop policy if exists "public reads pricing overrides" on public.pricing_overrides;
create policy "public reads pricing overrides" on public.pricing_overrides
for select to anon, authenticated using (true);
grant select on table public.pricing_overrides to anon;

-- Ensure all application buckets exist and remain private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('rb-order-photos', 'rb-order-photos', false, 10485760, array['image/jpeg','image/png','image/webp']::text[]),
  ('rb-project-media', 'rb-project-media', false, 10485760, array['image/jpeg','image/png','image/webp']::text[]),
  ('rb-review-photos', 'rb-review-photos', false, 10485760, array['image/jpeg','image/png','image/webp']::text[]),
  ('rb-project-documents', 'rb-project-documents', false, 26214400, array[
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet','text/plain',
    'image/jpeg','image/png','image/webp'
  ]::text[])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins read rb storage" on storage.objects;
drop policy if exists "admins upload rb storage" on storage.objects;
drop policy if exists "admins update rb storage" on storage.objects;
drop policy if exists "admins delete rb storage" on storage.objects;
drop policy if exists "anon uploads pending review photos" on storage.objects;
drop policy if exists "anon removes unregistered review photos" on storage.objects;

create policy "admins read rb storage" on storage.objects
for select to authenticated
using (
  public.is_admin()
  and bucket_id in ('rb-order-photos','rb-project-media','rb-review-photos','rb-project-documents')
);

-- Bucket configuration enforces MIME and size. RLS enforces the admin role and
-- exact path shape, without fragile subqueries into application tables.
create policy "admins upload rb storage" on storage.objects
for insert to authenticated
with check (
  public.is_admin()
  and (
    (bucket_id = 'rb-order-photos' and array_length(storage.foldername(name), 1) = 1)
    or (bucket_id = 'rb-project-media' and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('before','process','after'))
    or (bucket_id = 'rb-review-photos' and array_length(storage.foldername(name), 1) = 1)
    or (bucket_id = 'rb-project-documents' and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('contract','act','additional'))
  )
);

create policy "admins update rb storage" on storage.objects
for update to authenticated
using (
  public.is_admin()
  and bucket_id in ('rb-order-photos','rb-project-media','rb-review-photos','rb-project-documents')
)
with check (
  public.is_admin()
  and bucket_id in ('rb-order-photos','rb-project-media','rb-review-photos','rb-project-documents')
);

create policy "admins delete rb storage" on storage.objects
for delete to authenticated
using (
  public.is_admin()
  and bucket_id in ('rb-order-photos','rb-project-media','rb-review-photos','rb-project-documents')
);

create policy "anon uploads pending review photos" on storage.objects
for insert to anon
with check (
  bucket_id = 'rb-review-photos'
  and array_length(storage.foldername(name), 1) = 1
  and public.can_upload_pending_review_photo((storage.foldername(name))[1])
);

-- 005 introduced these functions. Reassert least-privilege grants if 005 was
-- partially applied; the registration function performs the final DB write.
create or replace function public.discard_pending_review(review_id text)
returns void
language plpgsql
security definer
set search_path = public, storage
set row_security = off
as $$
begin
  if public.can_upload_pending_review_photo(review_id) then
    delete from storage.objects
    where bucket_id = 'rb-review-photos'
      and (storage.foldername(name))[1] = review_id;

    delete from public.reviews
    where id = review_id
      and status = 'pending'
      and not is_published
      and photos = '[]'::jsonb;
  end if;
end;
$$;

revoke all on function public.register_pending_review_photos(text, jsonb) from public;
revoke all on function public.discard_pending_review(text) from public;
grant execute on function public.register_pending_review_photos(text, jsonb) to anon;
grant execute on function public.discard_pending_review(text) to anon;

commit;

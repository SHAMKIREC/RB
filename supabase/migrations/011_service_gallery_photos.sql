-- Owner-managed photos displayed below service price lists.
create table if not exists public.service_gallery_photos (
  id uuid primary key default gen_random_uuid(),
  service_key text not null,
  storage_path text not null unique,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create index if not exists service_gallery_photos_key_order_idx
  on public.service_gallery_photos(service_key, sort_order, created_at);

alter table public.service_gallery_photos enable row level security;

drop policy if exists "public reads service gallery photos" on public.service_gallery_photos;
create policy "public reads service gallery photos"
on public.service_gallery_photos for select to anon, authenticated
using (true);

drop policy if exists "admins manage service gallery photos" on public.service_gallery_photos;
create policy "admins manage service gallery photos"
on public.service_gallery_photos for all to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on table public.service_gallery_photos from public;
grant select on table public.service_gallery_photos to anon;
grant select, insert, update, delete on table public.service_gallery_photos to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('rb-service-gallery', 'rb-service-gallery', false, 10485760,
  array['image/jpeg','image/png','image/webp']::text[])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads registered service gallery files" on storage.objects;
create policy "public reads registered service gallery files"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'rb-service-gallery'
  and exists (
    select 1 from public.service_gallery_photos photo
    where photo.storage_path = name
  )
);

drop policy if exists "admins upload service gallery files" on storage.objects;
create policy "admins upload service gallery files"
on storage.objects for insert to authenticated
with check (
  public.is_admin()
  and bucket_id = 'rb-service-gallery'
  and array_length(storage.foldername(name), 1) = 1
);

drop policy if exists "admins update service gallery files" on storage.objects;
create policy "admins update service gallery files"
on storage.objects for update to authenticated
using (public.is_admin() and bucket_id = 'rb-service-gallery')
with check (public.is_admin() and bucket_id = 'rb-service-gallery');

drop policy if exists "admins delete service gallery files" on storage.objects;
create policy "admins delete service gallery files"
on storage.objects for delete to authenticated
using (public.is_admin() and bucket_id = 'rb-service-gallery');

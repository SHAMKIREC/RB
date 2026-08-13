begin;

-- Публичная форма заранее создаёт pending-отзыв с UUID, затем загружает
-- изображения в приватный bucket и регистрирует точные object paths через RPC.
grant insert (id, client_name, location, service_title, review_text, rating,
  photos, order_number, contact, consent)
on public.reviews to anon;

drop policy if exists "anon uploads pending review photos" on storage.objects;
create policy "anon uploads pending review photos"
on storage.objects for insert to anon
with check (
  bucket_id = 'rb-review-photos'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1 from public.reviews r
    where r.id = (storage.foldername(name))[1]
      and r.status = 'pending'
      and not r.is_published
      and r.photos = '[]'::jsonb
  )
  and coalesce(metadata ->> 'mimetype', '') in ('image/jpeg', 'image/png', 'image/webp')
  and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
);

drop policy if exists "anon removes unregistered review photos" on storage.objects;
create policy "anon removes unregistered review photos"
on storage.objects for delete to anon
using (
  bucket_id = 'rb-review-photos'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1 from public.reviews r
    where r.id = (storage.foldername(name))[1]
      and r.status = 'pending'
      and not r.is_published
      and r.photos = '[]'::jsonb
  )
);

create or replace function public.register_pending_review_photos(
  review_id text,
  photo_records jsonb
)
returns void
language plpgsql
security definer
set search_path = public, storage
as $$
begin
  if jsonb_typeof(photo_records) <> 'array' or jsonb_array_length(photo_records) > 10 then
    raise exception 'Invalid review photo list';
  end if;

  if exists (
    select 1 from jsonb_array_elements(photo_records) photo
    where jsonb_typeof(photo) <> 'object'
       or coalesce(photo ->> 'src', '') !~ ('^' || review_id || '/[0-9a-f-]+\.(jpg|jpeg|png|webp)$')
       or not exists (
         select 1 from storage.objects object
         where object.bucket_id = 'rb-review-photos'
           and object.name = photo ->> 'src'
       )
  ) then
    raise exception 'Invalid or missing review photo';
  end if;

  update public.reviews
  set photos = photo_records
  where id = review_id
    and status = 'pending'
    and not is_published
    and photos = '[]'::jsonb;

  if not found then raise exception 'Pending review not found'; end if;
end;
$$;

create or replace function public.discard_pending_review(review_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.reviews
  where id = review_id
    and status = 'pending'
    and not is_published
    and photos = '[]'::jsonb;
end;
$$;

revoke all on function public.register_pending_review_photos(text, jsonb) from public;
revoke all on function public.discard_pending_review(text) from public;
grant execute on function public.register_pending_review_photos(text, jsonb) to anon;
grant execute on function public.discard_pending_review(text) to anon;

commit;

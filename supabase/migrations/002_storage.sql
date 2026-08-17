begin;

-- Все buckets остаются приватными. Публичное чтение выдаётся только через
-- RLS storage.objects после проверки опубликованной записи в PostgreSQL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'rb-order-photos',
    'rb-order-photos',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
  ),
  (
    'rb-project-media',
    'rb-project-media',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
  ),
  (
    'rb-review-photos',
    'rb-review-photos',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
  ),
  (
    'rb-project-documents',
    'rb-project-documents',
    false,
    26214400,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]::text[]
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Ожидаемая структура object name (путь внутри bucket):
-- rb-order-photos:      <order_id>/<uuid>.<ext>
-- rb-project-media:     <project_id>/<before|process|after>/<uuid>.<ext>
-- rb-review-photos:     <review_id>/<uuid>.<ext>
-- rb-project-documents: <project_id>/<contract|act|additional>/<uuid>.<ext>
--
-- В таблицах сохраняется object name, а не Base64:
-- orders.photos[]                  -> пути rb-order-photos
-- project_media.src               -> путь rb-project-media
-- reviews.photos[*].src           -> путь rb-review-photos
-- project_documents.src           -> путь rb-project-documents

-- Удаляем только политики этой миграции, чтобы файл можно было безопасно
-- повторить при настройке нового Supabase-проекта.
drop policy if exists "public reads published order photos" on storage.objects;
drop policy if exists "public reads published project media" on storage.objects;
drop policy if exists "public reads published review photos" on storage.objects;
drop policy if exists "public reads published project documents" on storage.objects;
drop policy if exists "admins read rb storage" on storage.objects;
drop policy if exists "admins upload rb storage" on storage.objects;
drop policy if exists "admins update rb storage" on storage.objects;
drop policy if exists "admins delete rb storage" on storage.objects;

-- Фотография заказа доступна анонимно только когда:
-- 1) заказ опубликован и активен;
-- 2) путь файла зарегистрирован в orders.photos;
-- 3) первая папка пути совпадает с id заказа.
create policy "public reads published order photos"
on storage.objects
for select
to anon
using (
  bucket_id = 'rb-order-photos'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1
    from public.orders o
    where o.id = (storage.foldername(name))[1]
      and o.is_published
      and o.status = 'active'
      and name = any(o.photos)
  )
);

-- Изображение проекта доступно анонимно только после публикации проекта и
-- регистрации пути в project_media. Stage одновременно проверяется по пути.
create policy "public reads published project media"
on storage.objects
for select
to anon
using (
  bucket_id = 'rb-project-media'
  and array_length(storage.foldername(name), 1) = 2
  and (storage.foldername(name))[2] in ('before', 'process', 'after')
  and exists (
    select 1
    from public.project_media pm
    join public.projects p on p.id = pm.project_id
    where p.id = (storage.foldername(name))[1]
      and p.is_published
      and pm.stage = (storage.foldername(name))[2]
      and pm.src = name
  )
);

-- Фотография отзыва доступна анонимно только после публикации отзыва и
-- регистрации пути в reviews.photos. Поддерживаются объекты {src, name};
-- строковый вариант оставлен для безопасной миграции старых записей.
create policy "public reads published review photos"
on storage.objects
for select
to anon
using (
  bucket_id = 'rb-review-photos'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1
    from public.reviews r
    where r.id = (storage.foldername(name))[1]
      and r.is_published
      and r.status = 'published'
      and exists (
        select 1
        from jsonb_array_elements(r.photos) photo
        where case
          when jsonb_typeof(photo) = 'string' then trim(both '"' from photo::text) = name
          when jsonb_typeof(photo) = 'object' then photo ->> 'src' = name
          else false
        end
      )
  )
);

-- Только документы, явно отмеченные is_public, доступны анонимно. Приватные
-- договоры, акты и дополнительные документы остаются закрытыми.
create policy "public reads published project documents"
on storage.objects
for select
to anon
using (
  bucket_id = 'rb-project-documents'
  and array_length(storage.foldername(name), 1) = 2
  and (storage.foldername(name))[2] in ('contract', 'act', 'additional')
  and exists (
    select 1
    from public.project_documents pd
    join public.projects p on p.id = pd.project_id
    where p.id = (storage.foldername(name))[1]
      and p.is_published
      and pd.is_public
      and pd.document_type = (storage.foldername(name))[2]
      and pd.src = name
  )
);

-- Администратор может читать все файлы RB, включая черновики и приватные
-- документы. Проверка выполняется через public.is_admin() из миграции 001.
create policy "admins read rb storage"
on storage.objects
for select
to authenticated
using (
  bucket_id in (
    'rb-order-photos',
    'rb-project-media',
    'rb-review-photos',
    'rb-project-documents'
  )
  and public.is_admin()
);

-- Загружать файлы может только администратор. Дополнительно проверяются
-- существование родительской записи, структура пути, MIME и размер.
create policy "admins upload rb storage"
on storage.objects
for insert
to authenticated
with check (
  public.is_admin()
  and (
    (
      bucket_id = 'rb-order-photos'
      and array_length(storage.foldername(name), 1) = 1
      and exists (
        select 1 from public.orders o
        where o.id = (storage.foldername(name))[1]
      )
      and coalesce(metadata ->> 'mimetype', '') in (
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
    )
    or
    (
      bucket_id = 'rb-project-media'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('before', 'process', 'after')
      and exists (
        select 1 from public.projects p
        where p.id = (storage.foldername(name))[1]
      )
      and coalesce(metadata ->> 'mimetype', '') in (
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
    )
    or
    (
      bucket_id = 'rb-review-photos'
      and array_length(storage.foldername(name), 1) = 1
      and exists (
        select 1 from public.reviews r
        where r.id = (storage.foldername(name))[1]
      )
      and coalesce(metadata ->> 'mimetype', '') in (
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
    )
    or
    (
      bucket_id = 'rb-project-documents'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('contract', 'act', 'additional')
      and exists (
        select 1 from public.projects p
        where p.id = (storage.foldername(name))[1]
      )
      and coalesce(metadata ->> 'mimetype', '') in (
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.oasis.opendocument.spreadsheet',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/webp'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 26214400
    )
  )
);

-- UPDATE означает замену содержимого/метаданных существующего объекта.
-- Старый и новый объект должны оставаться в RB buckets, а новый путь обязан
-- соответствовать той же безопасной структуре и ограничениям.
create policy "admins update rb storage"
on storage.objects
for update
to authenticated
using (
  public.is_admin()
  and bucket_id in (
    'rb-order-photos',
    'rb-project-media',
    'rb-review-photos',
    'rb-project-documents'
  )
)
with check (
  public.is_admin()
  and (
    (
      bucket_id = 'rb-order-photos'
      and array_length(storage.foldername(name), 1) = 1
      and exists (select 1 from public.orders o where o.id = (storage.foldername(name))[1])
      and coalesce(metadata ->> 'mimetype', '') in (
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
    )
    or
    (
      bucket_id = 'rb-project-media'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('before', 'process', 'after')
      and exists (select 1 from public.projects p where p.id = (storage.foldername(name))[1])
      and coalesce(metadata ->> 'mimetype', '') in (
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
    )
    or
    (
      bucket_id = 'rb-review-photos'
      and array_length(storage.foldername(name), 1) = 1
      and exists (select 1 from public.reviews r where r.id = (storage.foldername(name))[1])
      and coalesce(metadata ->> 'mimetype', '') in (
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 10485760
    )
    or
    (
      bucket_id = 'rb-project-documents'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('contract', 'act', 'additional')
      and exists (select 1 from public.projects p where p.id = (storage.foldername(name))[1])
      and coalesce(metadata ->> 'mimetype', '') in (
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.oasis.opendocument.spreadsheet',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/webp'
      )
      and coalesce((metadata ->> 'size')::bigint, 0) between 1 and 26214400
    )
  )
);

-- Удаление доступно только администратору. Анонимные пользователи не имеют
-- INSERT/UPDATE/DELETE policy и не могут менять ни свои, ни чужие файлы.
create policy "admins delete rb storage"
on storage.objects
for delete
to authenticated
using (
  public.is_admin()
  and bucket_id in (
    'rb-order-photos',
    'rb-project-media',
    'rb-review-photos',
    'rb-project-documents'
  )
);

commit;

begin;

create table if not exists public.published_review_public_data (
  id text primary key,
  client_name text not null,
  location text null,
  service_title text not null,
  review_text text not null,
  rating smallint not null,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

alter table public.published_review_public_data enable row level security;

revoke all on table public.published_review_public_data from public, anon, authenticated;
grant select on table public.published_review_public_data to anon, authenticated;

drop policy if exists "public reads sanitized published reviews" on public.published_review_public_data;
create policy "public reads sanitized published reviews"
on public.published_review_public_data
for select
to anon, authenticated
using (true);

create or replace function public.sync_published_review_public_data()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_id text;
begin
  v_id := case when tg_op = 'DELETE' then old.id else new.id end;

  if tg_op <> 'DELETE'
     and new.is_published
     and new.status = 'published'
     and new.publish_review then
    insert into public.published_review_public_data (
      id, client_name, location, service_title, review_text, rating, photos, created_at, updated_at
    ) values (
      new.id,
      case when new.publish_name then coalesce(nullif(new.client_name, ''), 'Клиент RB-24') else 'Клиент RB-24' end,
      case when new.publish_location then nullif(new.location, '') else null end,
      new.service_title,
      new.review_text,
      new.rating,
      case when new.publish_photos then new.photos else '[]'::jsonb end,
      new.created_at,
      new.updated_at
    )
    on conflict (id) do update set
      client_name = excluded.client_name,
      location = excluded.location,
      service_title = excluded.service_title,
      review_text = excluded.review_text,
      rating = excluded.rating,
      photos = excluded.photos,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at;
  else
    delete from public.published_review_public_data where id = v_id;
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke execute on function public.sync_published_review_public_data() from public, anon, authenticated;

drop trigger if exists sync_published_review_public_data_trigger on public.reviews;
create trigger sync_published_review_public_data_trigger
after insert or update or delete on public.reviews
for each row execute function public.sync_published_review_public_data();

insert into public.published_review_public_data (
  id, client_name, location, service_title, review_text, rating, photos, created_at, updated_at
)
select
  id,
  case when publish_name then coalesce(nullif(client_name, ''), 'Клиент RB-24') else 'Клиент RB-24' end,
  case when publish_location then nullif(location, '') else null end,
  service_title,
  review_text,
  rating,
  case when publish_photos then photos else '[]'::jsonb end,
  created_at,
  updated_at
from public.reviews
where is_published and status = 'published' and publish_review
on conflict (id) do update set
  client_name = excluded.client_name,
  location = excluded.location,
  service_title = excluded.service_title,
  review_text = excluded.review_text,
  rating = excluded.rating,
  photos = excluded.photos,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

create or replace view public.published_reviews
with (security_invoker = true, security_barrier = true)
as
select
  id,
  client_name,
  location,
  service_title,
  review_text,
  rating,
  photos,
  created_at,
  updated_at
from public.published_review_public_data;

create or replace view public.published_reviews_list
with (security_invoker = true, security_barrier = true)
as
select
  id,
  client_name,
  location,
  service_title,
  review_text,
  rating,
  case jsonb_typeof(photos -> 0)
    when 'string' then photos ->> 0
    when 'object' then (photos -> 0) ->> 'src'
    else null
  end as cover_path,
  created_at,
  updated_at
from public.published_review_public_data;

revoke all privileges on table public.published_reviews from public, anon, authenticated;
revoke all privileges on table public.published_reviews_list from public, anon, authenticated;
grant select on table public.published_reviews to anon, authenticated;
grant select on table public.published_reviews_list to anon, authenticated;

commit;

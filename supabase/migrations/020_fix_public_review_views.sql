begin;

create or replace view public.published_reviews
with (security_invoker = false, security_barrier = true)
as
select
  id,
  case when publish_name then coalesce(nullif(client_name, ''), 'Клиент RB-24') else 'Клиент RB-24' end as client_name,
  case when publish_location then nullif(location, '') else null end as location,
  service_title,
  review_text,
  rating,
  case when publish_photos then photos else '[]'::jsonb end as photos,
  created_at,
  updated_at
from public.reviews
where is_published and status = 'published' and publish_review;

create or replace view public.published_reviews_list
with (security_invoker = false, security_barrier = true)
as
select
  id,
  case when publish_name then coalesce(nullif(client_name, ''), 'Клиент RB-24') else 'Клиент RB-24' end as client_name,
  case when publish_location then nullif(location, '') else null end as location,
  service_title,
  review_text,
  rating,
  case
    when publish_photos then
      case jsonb_typeof(photos -> 0)
        when 'string' then photos ->> 0
        when 'object' then (photos -> 0) ->> 'src'
        else null
      end
    else null
  end as cover_path,
  created_at,
  updated_at
from public.reviews
where is_published and status = 'published' and publish_review;

revoke all privileges on table public.published_reviews from public, anon, authenticated;
revoke all privileges on table public.published_reviews_list from public, anon, authenticated;
grant select on table public.published_reviews to anon, authenticated;
grant select on table public.published_reviews_list to anon, authenticated;

commit;

begin;

-- Lightweight public projections for list pages. Detail pages continue to use
-- the existing published_orders, published_projects and published_reviews views.
create or replace view public.published_orders_list
with (security_invoker = true)
as
select
  o.id,
  o.number,
  o.title,
  o.location,
  o.description,
  o.preferred_deadline,
  o.contractor_payment,
  o.photos[1] as cover_path,
  coalesce((
    select count(ow.id)::integer
    from public.order_works ow
    where ow.order_id = o.id
  ), 0) as works_count,
  o.created_at,
  o.updated_at
from public.orders o
where o.is_published and o.status = 'active';

create or replace view public.published_projects_list
with (security_invoker = true)
as
select
  p.id,
  p.client_name,
  p.location,
  p.title,
  p.description,
  p.deadline,
  p.final_total,
  p.total,
  cover.src as cover_path,
  p.created_at,
  p.updated_at
from public.projects p
left join lateral (
  select pm.src
  from public.project_media pm
  where pm.project_id = p.id
  order by pm.is_cover desc, pm.sort_order, pm.id
  limit 1
) cover on true
where p.is_published;

create or replace view public.published_reviews_list
with (security_invoker = true)
as
select
  r.id,
  r.client_name,
  r.location,
  r.service_title,
  r.review_text,
  r.rating,
  case jsonb_typeof(r.photos -> 0)
    when 'string' then r.photos ->> 0
    when 'object' then (r.photos -> 0) ->> 'src'
    else null
  end as cover_path,
  r.created_at,
  r.updated_at
from public.reviews r
where r.is_published and r.status = 'published';

revoke all privileges on table public.published_orders_list from public;
revoke all privileges on table public.published_projects_list from public;
revoke all privileges on table public.published_reviews_list from public;

grant select on table public.published_orders_list to anon, authenticated;
grant select on table public.published_projects_list to anon, authenticated;
grant select on table public.published_reviews_list to anon, authenticated;

commit;

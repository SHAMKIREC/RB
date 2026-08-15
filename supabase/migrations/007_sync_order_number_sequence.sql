begin;

create sequence if not exists public.order_number_seq
  as bigint
  start with 1047
  increment by 1;

-- Prevent inserts while max(orders.number) and the sequence state are aligned.
lock table public.orders in access exclusive mode;

alter sequence public.order_number_seq
  owned by public.orders.number;

alter table public.orders
  alter column number
  set default nextval('public.order_number_seq'::regclass);

grant usage, select on sequence public.order_number_seq to authenticated;

-- Treat the target as the last assigned value. With is_called = true, the next
-- nextval() returns target + 1. For a never-called sequence, last_value - 1 is
-- the last assigned value, so an untouched sequence still starts at 1047.
with sequence_state as (
  select last_value, is_called
  from public.order_number_seq
),
sync_target as (
  select greatest(
    coalesce((select max(number) from public.orders), 1046::bigint),
    case
      when is_called then last_value
      else last_value - 1
    end
  ) as last_assigned
  from sequence_state
)
select setval(
  'public.order_number_seq'::regclass,
  last_assigned,
  true
)
from sync_target;

commit;

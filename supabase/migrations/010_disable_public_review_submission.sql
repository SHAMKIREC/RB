begin;

-- Public review submission is no longer part of the site. Existing reviews and
-- published read views remain intact; only anonymous write/upload paths close.
revoke insert, update, delete on table public.reviews from anon;
drop policy if exists "anon submits pending reviews" on public.reviews;

revoke execute on function public.register_pending_review_photos(text, jsonb) from anon;
revoke execute on function public.discard_pending_review(text) from anon;
drop policy if exists "anon uploads pending review photos" on storage.objects;
drop policy if exists "anon removes unregistered review photos" on storage.objects;
revoke insert, update, delete on table storage.objects from anon;

commit;

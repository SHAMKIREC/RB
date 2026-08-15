import { getAdminSession } from './adminSession';
import { requireSupabase } from './supabaseClient';
import { errorMessage, removeFiles, signedImageUrl, signedUrls, STORAGE_BUCKETS, uploadReviewPhotos } from './mediaStorage';

const mapReview = (row) => ({ id: row.id, clientName: row.client_name, location: row.location, serviceTitle: row.service_title, reviewText: row.review_text, rating: Number(row.rating || 5), photos: row.photos || [], orderNumber: row.order_number || '', contact: row.contact || '', consent: Boolean(row.consent), status: row.status || 'pending', isPublished: row.is_published ?? true, isDemo: Boolean(row.is_demo), createdAt: row.created_at, updatedAt: row.updated_at });
const photoPath = (photo) => typeof photo === 'string' ? photo : photo?.path || photo?.src || '';

const hydrate = async (review, admin = false) => {
  const records = (review.photos || []).map((photo, index) => typeof photo === 'string' ? { src: photo, name: `photo-${index + 1}` } : photo);
  const paths = records.map(photoPath).filter(Boolean);
  const urls = await signedUrls(STORAGE_BUCKETS.reviews, paths);
  const byPath = new Map(urls.map((item) => [item.path, item.src]));
  return { ...review, photos: records.map((item) => ({ name: item.name, path: photoPath(item), src: byPath.get(photoPath(item)) || '' })).filter((item) => item.src || (admin && item.path)) };
};

const hydratePreview = async (review) => {
  const first = review.photos?.[0];
  if (!first) return { ...review, photos: [] };
  const record = typeof first === 'string' ? { src: first, name: 'photo-1' } : first;
  const url = await signedImageUrl(STORAGE_BUCKETS.reviews, photoPath(record));
  return { ...review, photos: url ? [{ name: record.name, path: photoPath(record), src: url }] : [] };
};

export async function getReviews() { const { data, error } = await requireSupabase().from('reviews').select('*').order('updated_at', { ascending: false }); if (error) throw error; return Promise.all((data || []).map((row) => hydrate(mapReview(row), true))); }
export async function getPublishedReviews(from = 0, to = 11) { const { data, error, count } = await requireSupabase().from('published_reviews_list').select('id,client_name,location,service_title,review_text,rating,cover_path,created_at,updated_at', { count: 'exact' }).order('updated_at', { ascending: false }).order('id', { ascending: false }).range(from, to); if (error) throw error; const items = await Promise.all((data || []).map((row) => hydratePreview(mapReview({ ...row, photos: row.cover_path ? [row.cover_path] : [], status: 'published', is_published: true })))); return { items, hasMore: count == null ? items.length === to - from + 1 : from + items.length < count }; }

export async function getPublishedReviewForProject(clientName, serviceTitle) {
  if (!clientName || !serviceTitle) return null;
  const { data, error } = await requireSupabase().from('published_reviews').select('id,client_name,location,service_title,review_text,rating,created_at,updated_at').eq('client_name', clientName).eq('service_title', serviceTitle).order('updated_at', { ascending: false }).order('id', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data ? mapReview({ ...data, status: 'published', is_published: true }) : null;
}

export async function saveReview(review) {
  const client = requireSupabase(); const admin = Boolean(await getAdminSession());
  if (!admin) {
    const id = crypto.randomUUID();
    const payload = { id, client_name: review.clientName, location: review.location, service_title: review.serviceTitle, review_text: review.reviewText, rating: Math.min(5, Math.max(1, Number(review.rating) || 5)), photos: [], order_number: review.orderNumber || '', contact: review.contact || '', consent: Boolean(review.consent) };
    const { error } = await client.from('reviews').insert(payload);
    if (error) throw new Error(`Database insert error (reviews): ${errorMessage(error)}`);
    let paths = [];
    try {
      paths = await uploadReviewPhotos(id, review.photos || []);
      const photos = paths.map((src, index) => ({ src, name: review.photos?.[index]?.name || `photo-${index + 1}` }));
      const { error: registerError } = await client.rpc('register_pending_review_photos', { review_id: id, photo_records: photos });
      if (registerError) throw new Error(`Database insert error (review photo paths): ${errorMessage(registerError)}`);
      return mapReview({ ...payload, photos, created_at: new Date().toISOString(), status: 'pending', is_published: false });
    } catch (submitError) {
      if (paths.length) await removeFiles(STORAGE_BUCKETS.reviews, paths).catch(() => {});
      try {
        await client.rpc('discard_pending_review', { review_id: id });
      } catch {
        // Best-effort cleanup must never replace the original submit error.
      }
      throw submitError;
    }
  }
  const id = review.id || crypto.randomUUID();
  const { data: current } = review.id ? await client.from('reviews').select('photos').eq('id', id).maybeSingle() : { data: null };
  const base = { id, client_name: review.clientName, location: review.location, service_title: review.serviceTitle, review_text: review.reviewText, rating: Math.min(5, Math.max(1, Number(review.rating) || 5)), photos: [], order_number: review.orderNumber || '', contact: review.contact || '', consent: Boolean(review.consent), status: review.status || 'pending', is_published: Boolean(review.isPublished), is_demo: Boolean(review.isDemo) };
  const { data, error } = await client.from('reviews').upsert(base).select().single(); if (error) throw new Error(`Database insert error (reviews): ${errorMessage(error)}`);
  let paths = [];
  try {
    paths = await uploadReviewPhotos(id, review.photos || []);
    const photos = paths.map((src, index) => ({ src, name: review.photos?.[index]?.name || `photo-${index + 1}` }));
    const { data: updated, error: updateError } = await client.from('reviews').update({ photos }).eq('id', id).select().single();
    if (updateError) throw new Error(`Database insert error (review photo paths): ${errorMessage(updateError)}`);
    const oldPaths = (current?.photos || []).map((item) => typeof item === 'string' ? item : item?.src).filter(Boolean);
    await removeFiles(STORAGE_BUCKETS.reviews, oldPaths.filter((path) => !paths.includes(path)));
    return mapReview(updated || data);
  } catch (saveError) {
    const oldPhotos = current?.photos || [];
    await removeFiles(STORAGE_BUCKETS.reviews, paths.filter((path) => !(oldPhotos || []).some((item) => photoPath(item) === path))).catch(() => {});
    if (review.id) await client.from('reviews').update({ photos: oldPhotos }).eq('id', id);
    else await client.from('reviews').delete().eq('id', id);
    throw saveError;
  }
}
export async function deleteReview(id) { const client = requireSupabase(); const { data } = await client.from('reviews').select('photos').eq('id', id).maybeSingle(); const { error } = await client.from('reviews').delete().eq('id', id); if (error) throw error; await removeFiles(STORAGE_BUCKETS.reviews, (data?.photos || []).map((item) => typeof item === 'string' ? item : item?.src)); }
export async function setReviewStatus(id, status) { const { data, error } = await requireSupabase().from('reviews').update({ status, is_published: status === 'published' }).eq('id', id).select().single(); if (error) throw error; return mapReview(data); }
export const createDemoReviews = getReviews;
export async function deleteDemoReviews() { const { error } = await requireSupabase().from('reviews').delete().eq('is_demo', true); if (error) throw error; return getReviews(); }

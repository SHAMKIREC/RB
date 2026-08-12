import { getAdminSession } from './adminSession';
import { requireSupabase } from './supabaseClient';
import { removeFiles, signedUrls, STORAGE_BUCKETS, uploadReviewPhotos } from './mediaStorage';

const mapReview = (row) => ({ id: row.id, clientName: row.client_name, location: row.location, serviceTitle: row.service_title, reviewText: row.review_text, rating: Number(row.rating || 5), photos: row.photos || [], orderNumber: row.order_number || '', contact: row.contact || '', consent: Boolean(row.consent), status: row.status || 'pending', isPublished: row.is_published ?? true, isDemo: Boolean(row.is_demo), createdAt: row.created_at, updatedAt: row.updated_at });
const photoPath = (photo) => typeof photo === 'string' ? photo : photo?.path || photo?.src || '';

const hydrate = async (review, admin = false) => {
  const records = (review.photos || []).map((photo, index) => typeof photo === 'string' ? { src: photo, name: `photo-${index + 1}` } : photo);
  const paths = records.map(photoPath).filter(Boolean);
  const urls = await signedUrls(STORAGE_BUCKETS.reviews, paths);
  const byPath = new Map(urls.map((item) => [item.path, item.src]));
  return { ...review, photos: records.map((item) => ({ name: item.name, path: photoPath(item), src: byPath.get(photoPath(item)) || '' })).filter((item) => item.src || (admin && item.path)) };
};

export async function getReviews() { const { data, error } = await requireSupabase().from('reviews').select('*').order('updated_at', { ascending: false }); if (error) throw error; return Promise.all((data || []).map((row) => hydrate(mapReview(row), true))); }
export async function getPublishedReviews() { const { data, error } = await requireSupabase().from('published_reviews').select('*').order('updated_at', { ascending: false }); if (error) throw error; return Promise.all((data || []).map((row) => hydrate(mapReview({ ...row, status: 'published', is_published: true }), false))); }

export async function saveReview(review) {
  const client = requireSupabase(); const admin = Boolean(await getAdminSession());
  if (!admin) {
    const payload = { client_name: review.clientName, location: review.location, service_title: review.serviceTitle, review_text: review.reviewText, rating: Math.min(5, Math.max(1, Number(review.rating) || 5)), photos: [], order_number: review.orderNumber || '', contact: review.contact || '', consent: Boolean(review.consent) };
    const { error } = await client.from('reviews').insert(payload);
    if (error) throw error;
    return mapReview({ ...payload, id: '', created_at: new Date().toISOString(), status: 'pending', is_published: false });
  }
  const id = review.id || crypto.randomUUID();
  const { data: current } = review.id ? await client.from('reviews').select('photos').eq('id', id).maybeSingle() : { data: null };
  const base = { id, client_name: review.clientName, location: review.location, service_title: review.serviceTitle, review_text: review.reviewText, rating: Math.min(5, Math.max(1, Number(review.rating) || 5)), photos: [], order_number: review.orderNumber || '', contact: review.contact || '', consent: Boolean(review.consent), status: review.status || 'pending', is_published: Boolean(review.isPublished), is_demo: Boolean(review.isDemo) };
  const { data, error } = await client.from('reviews').upsert(base).select().single(); if (error) throw error;
  const paths = await uploadReviewPhotos(id, review.photos || []);
  const photos = paths.map((src, index) => ({ src, name: review.photos?.[index]?.name || `photo-${index + 1}` }));
  const { data: updated, error: updateError } = await client.from('reviews').update({ photos }).eq('id', id).select().single(); if (updateError) throw updateError;
  const oldPaths = (current?.photos || []).map((item) => typeof item === 'string' ? item : item?.src).filter(Boolean);
  await removeFiles(STORAGE_BUCKETS.reviews, oldPaths.filter((path) => !paths.includes(path)));
  return mapReview(updated || data);
}
export async function deleteReview(id) { const client = requireSupabase(); const { data } = await client.from('reviews').select('photos').eq('id', id).maybeSingle(); const { error } = await client.from('reviews').delete().eq('id', id); if (error) throw error; await removeFiles(STORAGE_BUCKETS.reviews, (data?.photos || []).map((item) => typeof item === 'string' ? item : item?.src)); }
export async function setReviewStatus(id, status) { const { data, error } = await requireSupabase().from('reviews').update({ status, is_published: status === 'published' }).eq('id', id).select().single(); if (error) throw error; return mapReview(data); }
export const createDemoReviews = getReviews;
export async function deleteDemoReviews() { const { error } = await requireSupabase().from('reviews').delete().eq('is_demo', true); if (error) throw error; return getReviews(); }

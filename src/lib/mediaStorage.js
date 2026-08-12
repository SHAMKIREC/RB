import { requireSupabase } from './supabaseClient';

export const STORAGE_BUCKETS = {
  orders: 'rb-order-photos',
  projects: 'rb-project-media',
  reviews: 'rb-review-photos',
  documents: 'rb-project-documents',
};

const extension = (file) => {
  const fromName = file?.name?.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (fromName) return fromName;
  return file?.type?.split('/').pop()?.replace('jpeg', 'jpg') || 'bin';
};

const sourceFile = (value) => value instanceof File ? value : value?.file instanceof File ? value.file : null;
export const mediaPath = (value) => typeof value === 'string' ? value : value?.path || value?.storagePath || '';
export const mediaUrl = (value) => typeof value === 'string' ? value : value?.src || value?.url || '';

export async function uploadFile(bucket, path, file) {
  const client = requireSupabase();
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

const uploadPending = async (values, bucket, makePath) => Promise.all((values || []).map(async (value, index) => {
  const file = sourceFile(value);
  if (!file) return mediaPath(value) || mediaUrl(value);
  const path = makePath(file, index);
  await uploadFile(bucket, path, file);
  return path;
}));

export const uploadOrderPhotos = (orderId, values) => uploadPending(values, STORAGE_BUCKETS.orders,
  (file) => `${orderId}/${crypto.randomUUID()}.${extension(file)}`);

export const uploadProjectPhotos = (projectId, stage, values) => uploadPending(values, STORAGE_BUCKETS.projects,
  (file) => `${projectId}/${stage}/${crypto.randomUUID()}.${extension(file)}`);

export const uploadReviewPhotos = (reviewId, values) => uploadPending(values, STORAGE_BUCKETS.reviews,
  (file) => `${reviewId}/${crypto.randomUUID()}.${extension(file)}`);

export const uploadProjectDocuments = async (projectId, type, values) => Promise.all((values || []).map(async (value) => {
  const file = sourceFile(value);
  const existingPath = mediaPath(value);
  if (!file) return { ...value, src: existingPath || value?.src || '' };
  const path = `${projectId}/${type}/${crypto.randomUUID()}.${extension(file)}`;
  await uploadFile(STORAGE_BUCKETS.documents, path, file);
  return { name: value?.name || file.name, type: value?.type || file.type, src: path, isPublic: value?.isPublic === true };
}));

export async function removeFiles(bucket, paths) {
  const clean = [...new Set((paths || []).filter((path) => path && !path.startsWith('http') && !path.startsWith('blob:') && !path.startsWith('data:')))];
  if (!clean.length) return;
  const { error } = await requireSupabase().storage.from(bucket).remove(clean);
  if (error) throw error;
}

export async function signedUrls(bucket, paths, expiresIn = 3600) {
  const clean = (paths || []).filter(Boolean);
  if (!clean.length) return [];
  const { data, error } = await requireSupabase().storage.from(bucket).createSignedUrls(clean, expiresIn);
  if (error) throw error;
  return clean.map((path, index) => ({ path, src: data?.[index]?.signedUrl || '' }));
}

export async function signedUrl(bucket, path, expiresIn = 3600) {
  if (!path) return '';
  const [result] = await signedUrls(bucket, [path], expiresIn);
  return result?.src || '';
}

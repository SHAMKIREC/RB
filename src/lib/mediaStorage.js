import { requireSupabase } from './supabaseClient';

export const STORAGE_BUCKETS = {
  orders: 'rb-order-photos',
  projects: 'rb-project-media',
  reviews: 'rb-review-photos',
  documents: 'rb-project-documents',
};

/** @type {{ width: number, quality: number, resize: 'contain' }} */
export const CARD_IMAGE_TRANSFORM = { width: 640, quality: 75, resize: 'contain' };

const extension = (file) => {
  const fromName = file?.name?.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (fromName) return fromName;
  return file?.type?.split('/').pop()?.replace('jpeg', 'jpg') || 'bin';
};

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIDE = 1920;
const WEBP_QUALITY = 0.86;

const imageDimensions = (width, height) => {
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
};

const decodeImage = async (file) => {
  if (typeof createImageBitmap === 'function') {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch { /* fallback below */ }
  }
  const src = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Браузер не смог прочитать изображение.'));
      image.src = src;
    });
  } finally {
    URL.revokeObjectURL(src);
  }
};

export async function compressImage(file) {
  if (!IMAGE_TYPES.has(file?.type)) return file;

  const bitmap = await decodeImage(file);
  try {
    const dimensions = imageDimensions(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Браузер не смог подготовить изображение к загрузке.');
    context.drawImage(bitmap, 0, 0, dimensions.width, dimensions.height);
    const blob = await new Promise((resolve, reject) => canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error('Не удалось сжать изображение.')),
      'image/webp',
      WEBP_QUALITY,
    ));
    if (blob.size >= file.size && dimensions.width === bitmap.width && dimensions.height === bitmap.height) return file;
    const name = `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.webp`;
    return new File([blob], name, { type: 'image/webp', lastModified: file.lastModified });
  } finally {
    if (typeof bitmap.close === 'function') bitmap.close();
  }
}

export const errorMessage = (error, fallback = 'Неизвестная ошибка Supabase.') => {
  const parts = [error?.message, error?.details, error?.hint].filter(Boolean);
  return parts.length ? [...new Set(parts)].join(' ') : fallback;
};

export const supabaseError = (operation, error) => {
  const message = errorMessage(error);
  const lower = message.toLowerCase();
  const type = lower.includes('row-level security') || lower.includes('rls') || error?.code === '42501'
    ? 'RLS error'
    : operation;
  return new Error(`${type}: ${message}`);
};

const sourceFile = (value) => value instanceof File ? value : value?.file instanceof File ? value.file : null;
export const mediaPath = (value) => typeof value === 'string' ? value : value?.path || value?.storagePath || '';
export const mediaUrl = (value) => typeof value === 'string' ? value : value?.src || value?.url || '';

export async function uploadFile(bucket, path, file) {
  const client = requireSupabase();
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type || undefined,
  });
  if (error) throw supabaseError(`Storage upload error (${bucket})`, error);
  return path;
}

const uploadPending = async (values, bucket, makePath) => {
  const client = requireSupabase();
  const results = [];
  const uploaded = [];
  try {
    for (const [index, value] of (values || []).entries()) {
      const original = sourceFile(value);
      if (!original) {
        const existing = mediaPath(value) || mediaUrl(value);
        if (existing) results.push(existing);
        continue;
      }
      const file = await compressImage(original);
      const path = makePath(file, index);
      await uploadFile(bucket, path, file);
      uploaded.push(path);
      results.push(path);
    }
    return results;
  } catch (error) {
    if (uploaded.length) await client.storage.from(bucket).remove(uploaded);
    throw error;
  }
};

export const uploadOrderPhotos = (orderId, values) => uploadPending(values, STORAGE_BUCKETS.orders,
  (file) => `${orderId}/${crypto.randomUUID()}.${extension(file)}`);

export const uploadProjectPhotos = (projectId, stage, values) => uploadPending(values, STORAGE_BUCKETS.projects,
  (file) => `${projectId}/${stage}/${crypto.randomUUID()}.${extension(file)}`);

export const uploadReviewPhotos = (reviewId, values) => uploadPending(values, STORAGE_BUCKETS.reviews,
  (file) => `${reviewId}/${crypto.randomUUID()}.${extension(file)}`);

export const uploadProjectDocuments = async (projectId, type, values) => {
  const results = []; const uploaded = [];
  try {
    for (const value of values || []) {
      const file = sourceFile(value); const existingPath = mediaPath(value);
      if (!file) { results.push({ ...value, src: existingPath || value?.src || '' }); continue; }
      const path = `${projectId}/${type}/${crypto.randomUUID()}.${extension(file)}`;
      await uploadFile(STORAGE_BUCKETS.documents, path, file); uploaded.push(path);
      results.push({ name: value?.name || file.name, type: value?.type || file.type, src: path, isPublic: value?.isPublic === true });
    }
    return results;
  } catch (error) {
    if (uploaded.length) await removeFiles(STORAGE_BUCKETS.documents, uploaded).catch(() => {});
    throw error;
  }
};

export async function removeFiles(bucket, paths) {
  const clean = [...new Set((paths || []).filter((path) => path && !path.startsWith('http') && !path.startsWith('blob:') && !path.startsWith('data:')))];
  if (!clean.length) return;
  const { error } = await requireSupabase().storage.from(bucket).remove(clean);
  if (error) throw supabaseError(`Storage delete error (${bucket})`, error);
}

export async function signedUrls(bucket, paths, expiresIn = 3600) {
  const clean = (paths || []).filter(Boolean);
  if (!clean.length) return [];
  const storagePaths = [...new Set(clean.filter((path) => !/^(https?:|blob:|data:)/i.test(path)))];
  if (!storagePaths.length) return clean.map((path) => ({ path, src: path }));
  const { data, error } = await requireSupabase().storage.from(bucket).createSignedUrls(storagePaths, expiresIn);
  if (error) throw supabaseError(`Storage signed URL error (${bucket})`, error);
  const byPath = new Map(storagePaths.map((path, index) => {
    const result = data?.[index];
    return [path, result?.signedUrl || ''];
  }));
  return clean.map((path) => ({ path, src: byPath.get(path) || path }));
}

export async function signedUrl(bucket, path, expiresIn = 3600) {
  if (!path) return '';
  const [result] = await signedUrls(bucket, [path], expiresIn);
  return result?.src || '';
}

export async function signedImageUrl(bucket, path, transform = CARD_IMAGE_TRANSFORM, expiresIn = 3600) {
  if (!path || /^(https?:|blob:|data:)/i.test(path)) return path || '';
  const { data, error } = await requireSupabase().storage.from(bucket).createSignedUrl(path, expiresIn, { transform });
  if (error || !data?.signedUrl) throw supabaseError(`Storage transformed signed URL error (${bucket})`, error || new Error(`Не удалось получить transformed signed URL для ${path}.`));
  return data.signedUrl;
}

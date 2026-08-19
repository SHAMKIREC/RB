import { requireSupabase } from './supabaseClient';
import {
  mediaPath,
  mediaUrl,
  removeFiles,
  signedUrls,
  STORAGE_BUCKETS,
  uploadServicePhotos,
} from './mediaStorage';

export const SERVICE_GALLERY_CHANGED_EVENT = 'rb-service-gallery-changed';

const normalize = (value) => ({
  path: mediaPath(value),
  src: mediaUrl(value),
  file: value?.file,
});

export async function getServiceGallery(serviceKey) {
  if (!serviceKey) return [];
  const { data, error } = await requireSupabase()
    .from('service_gallery_photos')
    .select('id,service_key,storage_path,sort_order')
    .eq('service_key', serviceKey)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  const urls = await signedUrls(STORAGE_BUCKETS.services, (data || []).map((photo) => photo.storage_path), 3600);
  return (data || []).map((photo, index) => ({
    id: photo.id,
    path: photo.storage_path,
    src: urls[index]?.src || '',
    sortOrder: photo.sort_order,
  }));
}

export async function getAllServiceGalleries() {
  const { data, error } = await requireSupabase()
    .from('service_gallery_photos')
    .select('id,service_key,storage_path,sort_order')
    .order('service_key')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  const urls = await signedUrls(STORAGE_BUCKETS.services, (data || []).map((photo) => photo.storage_path), 3600);
  return (data || []).reduce((groups, photo, index) => ({
    ...groups,
    [photo.service_key]: [...(groups[photo.service_key] || []), {
      id: photo.id,
      path: photo.storage_path,
      src: urls[index]?.src || '',
      sortOrder: photo.sort_order,
    }],
  }), {});
}

export async function saveServiceGallery(serviceKey, values) {
  const client = requireSupabase();
  const current = await getServiceGallery(serviceKey);
  const currentPaths = new Set(current.map((photo) => photo.path));
  const normalized = (values || []).map(normalize);
  const paths = await uploadServicePhotos(serviceKey, normalized);
  const uploadedPaths = paths.filter((path) => !currentPaths.has(path));

  try {
    const { error: deleteRowsError } = await client
      .from('service_gallery_photos')
      .delete()
      .eq('service_key', serviceKey);
    if (deleteRowsError) throw deleteRowsError;

    if (paths.length) {
      const { error: insertError } = await client.from('service_gallery_photos').insert(
        paths.map((storagePath, index) => ({ service_key: serviceKey, storage_path: storagePath, sort_order: index })),
      );
      if (insertError) throw insertError;
    }

    const removedPaths = current.map((photo) => photo.path).filter((path) => !paths.includes(path));
    await removeFiles(STORAGE_BUCKETS.services, removedPaths);
    window.dispatchEvent(new CustomEvent(SERVICE_GALLERY_CHANGED_EVENT, { detail: { serviceKey } }));
    return getServiceGallery(serviceKey);
  } catch (error) {
    await removeFiles(STORAGE_BUCKETS.services, uploadedPaths).catch(() => {});
    throw error;
  }
}

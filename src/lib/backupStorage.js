import { requireSupabase } from './supabaseClient';
import { STORAGE_BUCKETS } from './mediaStorage';

const BACKUP_TABLES = [
  'orders',
  'order_works',
  'projects',
  'project_works',
  'project_media',
  'project_documents',
  'reviews',
  'pricing_overrides',
  'service_gallery_photos',
];

const BACKUP_BUCKETS = Object.values(STORAGE_BUCKETS);
const PAGE_SIZE = 500;

const bytesToBase64 = (bytes) => {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
};

const readAllRows = async (client, table) => {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client.from(table).select('*').range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Не удалось сохранить таблицу ${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
};

const listFiles = async (client, bucket, folder = '') => {
  const files = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await client.storage.from(bucket).list(folder, {
      limit: 100,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(`Не удалось прочитать хранилище ${bucket}: ${error.message}`);

    for (const item of data || []) {
      const path = folder ? `${folder}/${item.name}` : item.name;
      if (item.id) files.push(path);
      else files.push(...await listFiles(client, bucket, path));
    }
    if (!data || data.length < 100) break;
  }
  return files;
};

const readStoredFile = async (client, bucket, path) => {
  const { data, error } = await client.storage.from(bucket).download(path);
  if (error || !data) throw new Error(`Не удалось сохранить файл ${bucket}/${path}: ${error?.message || 'пустой ответ'}`);
  return {
    bucket,
    path,
    type: data.type || 'application/octet-stream',
    size: data.size,
    base64: bytesToBase64(new Uint8Array(await data.arrayBuffer())),
  };
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
};

const gzipJson = async (json) => {
  if (typeof CompressionStream !== 'function') return new Blob([json], { type: 'application/json' });
  const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Blob([await new Response(stream).arrayBuffer()], { type: 'application/gzip' });
};

export async function createFullBackup(onProgress = () => {}) {
  const client = requireSupabase();
  const createdAt = new Date();
  const database = {};

  for (const [index, table] of BACKUP_TABLES.entries()) {
    onProgress(`Сохраняю данные: ${index + 1} из ${BACKUP_TABLES.length}`);
    database[table] = await readAllRows(client, table);
  }

  const storage = [];
  for (const bucket of BACKUP_BUCKETS) {
    onProgress(`Проверяю фотографии: ${bucket}`);
    const paths = await listFiles(client, bucket);
    for (const [index, path] of paths.entries()) {
      onProgress(`Сохраняю ${bucket}: ${index + 1} из ${paths.length}`);
      storage.push(await readStoredFile(client, bucket, path));
    }
  }

  const backup = {
    format: 'rb-24-full-backup',
    version: 1,
    createdAt: createdAt.toISOString(),
    project: 'RB-rus',
    database,
    storage,
  };
  onProgress('Сжимаю резервную копию…');
  const json = JSON.stringify(backup);
  const blob = await gzipJson(json);
  const date = createdAt.toISOString().slice(0, 10);
  const compressed = blob.type === 'application/gzip';
  const filename = `rb-24-backup-${date}.json${compressed ? '.gz' : ''}`;
  downloadBlob(blob, filename);

  return {
    filename,
    tableRows: Object.values(database).reduce((sum, rows) => sum + rows.length, 0),
    files: storage.length,
    bytes: blob.size,
  };
}

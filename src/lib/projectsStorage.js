import { requireSupabase } from './supabaseClient';
import { requireAdminWriteSession } from './adminSession';
import { errorMessage, removeFiles, signedImageUrl, signedUrl, signedUrls, STORAGE_BUCKETS, uploadProjectDocuments, uploadProjectPhotos } from './mediaStorage';

export const PROJECTS_STORAGE_KEY = 'rb-projects-supabase';
export const PROJECTS_CHANGED_EVENT = 'rb-projects-changed';
const num = (value) => Number(value || 0);
const photoSrc = (photo) => typeof photo === 'string' ? photo : photo?.src || '';
const photoPath = (photo) => typeof photo === 'string' ? photo : photo?.path || photo?.storagePath || photo?.src || '';
const work = (row) => ({ workId: row.work_id, categoryId: row.category_id, groupId: row.group_id, title: row.title, unit: row.unit, unitPrice: num(row.unit_price), quantity: num(row.quantity), totalPrice: num(row.total_price) });

const mapProject = (row) => ({ id: row.id, clientName: row.client_name, location: row.location, title: row.title, description: row.description, deadline: row.deadline, review: row.review, works: (row.project_works || row.works || []).map(work), workSubtotal: num(row.work_subtotal), materialsSubtotal: num(row.materials_subtotal), extraCosts: num(row.extra_costs), calculatedTotal: num(row.calculated_total), finalTotal: num(row.final_total), total: num(row.total), isManualTotal: Boolean(row.is_manual_total), isPublished: row.is_published ?? true, isDemo: Boolean(row.is_demo), mediaRows: row.project_media || row.media || [], documentRows: row.project_documents || row.documents || [], createdAt: row.created_at, updatedAt: row.updated_at });

const hydrateProject = async (project, admin = false) => {
  const mediaRows = project.mediaRows || [];
  const paths = mediaRows.map((item) => item.src).filter(Boolean);
  const urls = await signedUrls(STORAGE_BUCKETS.projects, paths);
  const byPath = new Map(urls.map((item) => [item.path, item.src]));
  const photoGroups = { before: [], process: [], after: [] };
  mediaRows.forEach((item) => { if (photoGroups[item.stage]) photoGroups[item.stage].push(admin ? { path: item.src, src: byPath.get(item.src) || '' } : byPath.get(item.src) || ''); });
  const coverRow = mediaRows.find((item) => item.is_cover) || mediaRows[0];
  const documents = { contract: [], act: [], additional: [] };
  for (const item of project.documentRows || []) {
    const src = admin ? await signedUrl(STORAGE_BUCKETS.documents, item.src) : '';
    if (documents[item.document_type]) documents[item.document_type].push({ name: item.name, type: item.mime_type || item.type, src, path: item.src, isPublic: item.is_public ?? true });
  }
  return { ...project, photoGroups, photos: [...photoGroups.after, ...photoGroups.process, ...photoGroups.before], coverPhoto: coverRow ? (admin ? { path: coverRow.src, src: byPath.get(coverRow.src) || '' } : byPath.get(coverRow.src) || '') : '', documents };
};

const hydrateProjectPreview = async (project) => {
  const mediaRows = project.mediaRows || [];
  const coverRow = mediaRows.find((item) => item.is_cover) || mediaRows[0];
  const coverPhoto = await signedImageUrl(STORAGE_BUCKETS.projects, coverRow?.src);
  return { ...project, mediaRows: [], documentRows: [], photoGroups: { before: [], process: [], after: [] }, photos: coverPhoto ? [coverPhoto] : [], coverPhoto, documents: { contract: [], act: [], additional: [] } };
};

export const getProjectPhotoGroups = (project) => project?.photoGroups || { before: [], process: [], after: [] };
export const getPublicProjectPhotos = (project) => { const groups = getProjectPhotoGroups(project); return [...groups.before, ...groups.process, ...groups.after].map(photoSrc).filter(Boolean); };
export const getProjectCoverPhoto = (project) => photoSrc(project?.coverPhoto) || getPublicProjectPhotos(project)[0] || '';
export const getPublicProjectDocuments = (project) => ['contract', 'act', 'additional'].flatMap((type) => project?.documents?.[type] || []).filter((item) => item.isPublic);
export const getPublicProjectDocumentUrl = (document) => signedUrl(STORAGE_BUCKETS.documents, document?.path || document?.src);

export async function getProjects() {
  const { data, error } = await requireSupabase().from('projects').select('*, project_works(*), project_media(*), project_documents(*)').order('updated_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data || []).map((row) => hydrateProject(mapProject(row), true)));
}

export async function getPublishedProjects(from = 0, to = 11) {
  const { data, error, count } = await requireSupabase().from('published_projects_list').select('id,client_name,location,title,description,deadline,final_total,total,cover_path,created_at,updated_at', { count: 'exact' }).order('updated_at', { ascending: false }).order('id', { ascending: false }).range(from, to);
  if (error) throw error;
  const items = await Promise.all((data || []).map((row) => hydrateProjectPreview(mapProject({ ...row, is_published: true, project_media: row.cover_path ? [{ src: row.cover_path, is_cover: true }] : [] }))));
  return { items, hasMore: count == null ? items.length === to - from + 1 : from + items.length < count };
}

export async function getProject(id) {
  const { data, error } = await requireSupabase().from('published_projects').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? hydrateProject(mapProject({ ...data, is_published: true, project_media: data.media, project_documents: data.documents }), false) : null;
}

export async function saveProject(project) {
  const client = await requireAdminWriteSession();
  const id = project.id || crypto.randomUUID();
  const isNew = !project.id;
  const { data: oldProject, error: oldProjectError } = project.id ? await client.from('projects').select('*').eq('id', id).maybeSingle() : { data: null, error: null };
  if (oldProjectError) throw new Error(`Database read error (projects): ${errorMessage(oldProjectError)}`);
  const { data: oldMedia, error: oldMediaError } = project.id ? await client.from('project_media').select('project_id,stage,src,is_cover,sort_order').eq('project_id', id) : { data: [], error: null };
  if (oldMediaError) throw new Error(`Не удалось прочитать фотографии проекта: ${errorMessage(oldMediaError)}`);
  const { data: oldDocuments, error: oldDocumentsError } = project.id ? await client.from('project_documents').select('project_id,document_type,name,mime_type,src,is_public,sort_order').eq('project_id', id) : { data: [], error: null };
  if (oldDocumentsError) throw new Error(`Не удалось прочитать документы проекта: ${errorMessage(oldDocumentsError)}`);
  const { data: oldWorks, error: oldWorksError } = project.id ? await client.from('project_works').select('project_id,work_id,category_id,group_id,title,unit,unit_price,quantity,total_price,sort_order').eq('project_id', id) : { data: [], error: null };
  if (oldWorksError) throw new Error(`Не удалось прочитать работы проекта: ${errorMessage(oldWorksError)}`);
  const payload = { id, client_name: project.clientName || '', location: project.location || '', title: project.title, description: project.description || '', deadline: project.deadline || '', review: project.review || '', work_subtotal: num(project.workSubtotal), materials_subtotal: num(project.materialsSubtotal), extra_costs: num(project.extraCosts), calculated_total: num(project.calculatedTotal), final_total: num(project.finalTotal), total: num(project.total), is_manual_total: Boolean(project.isManualTotal), is_published: Boolean(project.isPublished), is_demo: Boolean(project.isDemo) };
  const { data: saved, error } = await client.from('projects').upsert(payload).select().single();
  if (error) throw new Error(`Database insert error (projects): ${errorMessage(error)}`);
  const oldMediaPaths = (oldMedia || []).map((item) => item.src);
  const oldDocumentPaths = (oldDocuments || []).map((item) => item.src);
  let media = [];
  let documentRows = [];
  const newlyUploadedMedia = [];
  const newlyUploadedDocuments = [];
  try {
    const groups = project.photoGroups || { before: [], process: [], after: project.photos || [] };
    const uploaded = {};
    for (const stage of ['before', 'process', 'after']) {
      uploaded[stage] = await uploadProjectPhotos(id, stage, groups[stage] || []);
      newlyUploadedMedia.push(...uploaded[stage].filter((path) => !oldMediaPaths.includes(path)));
    }
    const coverPath = uploaded.after[0] || uploaded.process[0] || uploaded.before[0] || photoPath(project.coverPhoto) || '';
    media = ['before', 'process', 'after'].flatMap((stage) => uploaded[stage].map((src, index) => ({ project_id: id, stage, src, is_cover: src === coverPath, sort_order: index })));
    const { error: deleteMediaError } = await client.from('project_media').delete().eq('project_id', id);
    if (deleteMediaError) throw new Error(`Не удалось обновить список фотографий проекта: ${errorMessage(deleteMediaError)}`);
    if (media.length) {
      const { error: mediaError } = await client.from('project_media').insert(media);
      if (mediaError) throw new Error(`Фотографии загружены, но пути не сохранены в project_media: ${errorMessage(mediaError)}`);
    }

    const { error: deleteWorksError } = await client.from('project_works').delete().eq('project_id', id);
    if (deleteWorksError) throw new Error(`Не удалось обновить работы проекта: ${errorMessage(deleteWorksError)}`);
    const works = (project.works || []).map((item, index) => ({ project_id: id, work_id: item.workId || null, category_id: item.categoryId || null, group_id: item.groupId || null, title: item.title, unit: item.unit || '', unit_price: num(item.unitPrice), quantity: num(item.quantity), total_price: num(item.totalPrice), sort_order: index }));
    if (works.length) {
      const { error: worksError } = await client.from('project_works').insert(works);
      if (worksError) throw new Error(`Не удалось сохранить работы проекта: ${errorMessage(worksError)}`);
    }

    const docs = {};
    for (const type of ['contract', 'act', 'additional']) {
      docs[type] = await uploadProjectDocuments(id, type, project.documents?.[type] || []);
      newlyUploadedDocuments.push(...docs[type].map((item) => item.src).filter((path) => !oldDocumentPaths.includes(path)));
    }
    documentRows = ['contract', 'act', 'additional'].flatMap((type) => docs[type].map((item, index) => ({ project_id: id, document_type: type, name: item.name, mime_type: item.type, src: item.src, is_public: item.isPublic === true, sort_order: index })));
    const { error: deleteDocumentsError } = await client.from('project_documents').delete().eq('project_id', id);
    if (deleteDocumentsError) throw new Error(`Не удалось обновить документы проекта: ${errorMessage(deleteDocumentsError)}`);
    if (documentRows.length) {
      const { error: docsError } = await client.from('project_documents').insert(documentRows);
      if (docsError) throw new Error(`Документы загружены, но пути не сохранены: ${errorMessage(docsError)}`);
    }

    await removeFiles(STORAGE_BUCKETS.projects, oldMediaPaths.filter((path) => !media.some((item) => item.src === path)));
    await removeFiles(STORAGE_BUCKETS.documents, oldDocumentPaths.filter((path) => !documentRows.some((item) => item.src === path)));
    window.dispatchEvent(new CustomEvent(PROJECTS_CHANGED_EVENT));
    return mapProject({ ...saved, project_works: works, project_media: media, project_documents: documentRows });
  } catch (saveError) {
    await removeFiles(STORAGE_BUCKETS.projects, newlyUploadedMedia).catch(() => {});
    await removeFiles(STORAGE_BUCKETS.documents, newlyUploadedDocuments).catch(() => {});
    if (isNew) await client.from('projects').delete().eq('id', id);
    else {
      const oldProjectData = Object.fromEntries(Object.entries(oldProject).filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key)));
      await client.from('projects').update(oldProjectData).eq('id', id);
      await client.from('project_media').delete().eq('project_id', id);
      if (oldMedia?.length) await client.from('project_media').insert(oldMedia);
      await client.from('project_documents').delete().eq('project_id', id);
      if (oldDocuments?.length) await client.from('project_documents').insert(oldDocuments);
      await client.from('project_works').delete().eq('project_id', id);
      if (oldWorks?.length) await client.from('project_works').insert(oldWorks);
    }
    throw saveError;
  }
}

export async function deleteProject(id) {
  const client = await requireAdminWriteSession();
  const [{ data: media }, { data: docs }] = await Promise.all([
    client.from('project_media').select('src').eq('project_id', id),
    client.from('project_documents').select('src').eq('project_id', id),
  ]);
  const { error } = await client.from('projects').delete().eq('id', id);
  if (error) throw error;
  await Promise.all([
    removeFiles(STORAGE_BUCKETS.projects, (media || []).map((item) => item.src)),
    removeFiles(STORAGE_BUCKETS.documents, (docs || []).map((item) => item.src)),
  ]);
  window.dispatchEvent(new CustomEvent(PROJECTS_CHANGED_EVENT));
}

export async function setProjectPublished(id, isPublished) {
  const client = await requireAdminWriteSession();
  const { data, error } = await client.from('projects').update({ is_published: isPublished }).eq('id', id).select().single();
  if (error) throw error;
  window.dispatchEvent(new CustomEvent(PROJECTS_CHANGED_EVENT));
  return mapProject(data);
}

export const createDemoProjects = getProjects;

export async function deleteDemoProjects() {
  const client = await requireAdminWriteSession();
  const { error } = await client.from('projects').delete().eq('is_demo', true);
  if (error) throw error;
  return getProjects();
}

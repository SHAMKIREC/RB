const KEY = 'rb_projects_mvp';
export const PROJECTS_STORAGE_KEY = KEY;
export const PROJECTS_CHANGED_EVENT = 'rb-projects-changed';
const DEMO_IDS = new Set(['demo-project-kitchen', 'demo-project-bathroom', 'demo-project-canopy']);
const read = () => { try { const projects = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(projects) ? projects : []; } catch { return []; } };
const write = (projects) => {
  localStorage.setItem(KEY, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent(PROJECTS_CHANGED_EVENT));
};

const photoSrc = (photo) => typeof photo === 'string' ? photo : typeof photo?.src === 'string' ? photo.src : '';
const photoList = (photos) => Array.isArray(photos) ? photos.map(photoSrc).filter(Boolean) : [];

export const getProjectPhotoGroups = (project) => {
  const groups = project?.photoGroups;
  if (groups && ['before', 'process', 'after'].some((key) => Array.isArray(groups[key]))) {
    return { before: photoList(groups.before), process: photoList(groups.process), after: photoList(groups.after) };
  }
  return { before: [], process: [], after: photoList(project?.photos) };
};

export const getPublicProjectPhotos = (project) => {
  const groups = getProjectPhotoGroups(project);
  return [...groups.before, ...groups.process, ...groups.after];
};

export const getProjectCoverPhoto = (project) => photoSrc(project?.coverPhoto) || getPublicProjectPhotos(project)[0] || '';

const documentList = (documents, type) => (Array.isArray(documents?.[type]) ? documents[type] : [])
  .map((document) => ({
    name: document?.name || 'Документ',
    type: document?.type || 'application/octet-stream',
    src: document?.src || document?.data || '',
    isPublic: document?.isPublic === true,
  }))
  .filter((document) => document.src);

export const getPublicProjectDocuments = (project) => ['contract', 'act', 'additional']
  .flatMap((type) => documentList(project?.documents, type))
  .filter((document) => document.isPublic);

export const getProjects = () => read().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
export const getPublishedProjects = () => getProjects().filter((project) => project.isPublished);
export const getProject = (id) => getProjects().find((project) => project.id === id);
export const saveProject = (project) => { const projects = read(); const now = new Date().toISOString(); const next = { ...project, id: project.id || crypto.randomUUID(), createdAt: project.createdAt || now, updatedAt: now }; const index = projects.findIndex((item) => item.id === next.id); if (index >= 0) projects[index] = next; else projects.push(next); write(projects); return next; };
export const deleteProject = (id) => write(read().filter((project) => project.id !== id));
export const setProjectPublished = (id, isPublished) => { const project = read().find((item) => item.id === id); return project ? saveProject({ ...project, isPublished }) : null; };
const image = (name) => new URL(`../assets/images/services/${name}`, import.meta.url).href;
export const createDemoProjects = () => { const current = read(); if (current.some((project) => DEMO_IDS.has(project.id))) return current; const now = new Date().toISOString(); const demos = [{ id: 'demo-project-kitchen', clientName: 'Александр', location: 'Люберцы, ул. Кирова', title: 'Ремонт кухни', description: 'Подготовка стен, финишная отделка и укладка напольного покрытия в кухне.', works: [{ title: 'Шпаклёвка под обои', unit: 'м²', quantity: 24, totalPrice: 13200 }, { title: 'Укладка ламината', unit: 'м²', quantity: 12, totalPrice: 7200 }], total: 20400, deadline: '12 дней', review: 'Работы выполнены аккуратно, сроки соблюдены. Результатом довольны.', photos: [image('remont_kvartiry.webp')], coverPhoto: image('remont_kvartiry.webp'), isPublished: true, isDemo: true, createdAt: now, updatedAt: now }, { id: 'demo-project-bathroom', clientName: 'Марина', location: 'Москва, Некрасовка', title: 'Ремонт ванной комнаты', description: 'Ремонт ванной комнаты с заменой сантехники и облицовкой плиткой.', works: [{ title: 'Укладка плитки', unit: 'м²', quantity: 20, totalPrice: 32000 }, { title: 'Установка сантехники', unit: 'шт', quantity: 3, totalPrice: 6700 }], total: 38700, deadline: '15 дней', review: 'Спасибо за внимательное отношение к деталям и понятную смету.', photos: [image('03_plitka.webp')], coverPhoto: image('03_plitka.webp'), isPublished: true, isDemo: true, createdAt: now, updatedAt: now }, { id: 'demo-project-canopy', clientName: 'Игорь', location: 'Московская область', title: 'Установка навеса', description: 'Изготовление и монтаж навеса над входной зоной частного дома.', works: [{ title: 'Навес над крыльцом', unit: 'шт', quantity: 1, totalPrice: 10000 }], total: 10000, deadline: '5 дней', review: 'Навес получился прочным и аккуратным. Благодарю за работу.', photos: [image('14_navesy_i_kozyrki.webp')], coverPhoto: image('14_navesy_i_kozyrki.webp'), isPublished: true, isDemo: true, createdAt: now, updatedAt: now }]; write([...current, ...demos]); return getProjects(); };
export const deleteDemoProjects = () => write(read().filter((project) => !DEMO_IDS.has(project.id)));

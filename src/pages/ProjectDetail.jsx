import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, MapPin, Star, X } from 'lucide-react';
import {
  getProject,
  getProjectCoverPhoto,
  getProjectPhotoGroups,
  getPublicProjectDocuments,
  getPublicProjectPhotos,
  PROJECTS_CHANGED_EVENT,
  PROJECTS_STORAGE_KEY,
} from '../lib/projectsStorage';
import { getPublishedReviews } from '../lib/reviewsStorage';

const money = (value) => `${Math.round(value || 0).toLocaleString('ru-RU')} ₽`;
const groupLabels = { before: 'До ремонта', process: 'В процессе', after: 'После ремонта' };

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [review, setReview] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const item = getProject(projectId);
      setProject(item);
      setReview(item ? getPublishedReviews().find((entry) => entry.clientName === item.clientName && entry.serviceTitle === item.title) || null : null);
    };
    const onStorage = (event) => { if (event.key === PROJECTS_STORAGE_KEY) refresh(); };
    refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(PROJECTS_CHANGED_EVENT, refresh);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(PROJECTS_CHANGED_EVENT, refresh); };
  }, [projectId]);

  const photoGroups = project ? getProjectPhotoGroups(project) : { before: [], process: [], after: [] };
  const photos = project ? getPublicProjectPhotos(project) : [];
  const cover = project ? getProjectCoverPhoto(project) : '';
  const galleryGroups = Object.entries(photoGroups)
    .map(([type, items]) => ({ type, label: groupLabels[type], photos: items.filter((photo) => photo !== cover) }))
    .filter((group) => group.photos.length);
  const galleryCount = galleryGroups.reduce((sum, group) => sum + group.photos.length, 0);
  const publicDocuments = project ? getPublicProjectDocuments(project) : [];

  useEffect(() => {
    const key = (event) => {
      if (openIndex === null) return;
      if (event.key === 'Escape') setOpenIndex(null);
      if (event.key === 'ArrowLeft') setOpenIndex((openIndex + photos.length - 1) % photos.length);
      if (event.key === 'ArrowRight') setOpenIndex((openIndex + 1) % photos.length);
    };
    window.addEventListener('keydown', key);
    document.body.style.overflow = openIndex === null ? '' : 'hidden';
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [openIndex, photos.length]);

  if (!project || !project.isPublished) return <div className="page-shell py-16">Проект не найден.</div>;

  return <div className="page-shell py-10 sm:py-16">
    <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />Все проекты</Link>
    <div className="mt-6 text-sm">
      <p className="font-semibold text-foreground">{project.clientName || 'Клиент не указан'}</p>
      {project.location && <p className="mt-1 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" />{project.location}</p>}
    </div>
    <h1 className="mt-2 text-3xl font-black">{project.title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">Срок: {project.deadline || 'не указан'} · {money(project.finalTotal ?? project.total ?? project.calculatedTotal ?? 0)}</p>
    {cover && <button onClick={() => setOpenIndex(photos.indexOf(cover))} className="mt-6 block h-[min(48vw,420px)] w-full rounded-2xl bg-secondary/60 p-4"><img src={cover} alt={project.title} className="h-full w-full object-contain object-center" /></button>}
    <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section>
        <h2 className="font-black">Описание проекта</h2>
        <p className="mt-3 whitespace-pre-line text-muted-foreground">{project.description || 'Описание не добавлено'}</p>
        {galleryGroups.length > 0 && <><h2 className="mt-7 font-black">Фотографии объекта</h2>{galleryGroups.map((group) => { const shown = expanded ? group.photos : group.photos.slice(0, 8); return <section key={group.type} className="mt-4"><h3 className="text-sm font-bold text-foreground">{group.label}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{shown.map((photo) => { const index = photos.indexOf(photo); return <button key={`${photo}-${index}`} onClick={() => setOpenIndex(index)} className="overflow-hidden rounded-xl bg-secondary/60 p-3 text-left"><img src={photo} alt={`${project.title}, ${group.label}`} className="aspect-[4/3] w-full object-contain object-center" /><span className="mt-2 block text-xs text-muted-foreground">{group.label}</span></button>; })}</div></section>; })}{galleryCount > 8 && <button onClick={() => setExpanded(!expanded)} className="mt-4 text-sm font-bold text-primary">{expanded ? 'Скрыть фотографии' : 'Показать все фотографии'}</button>}</>}
        {publicDocuments.length > 0 && <section className="mt-7"><h2 className="font-black">Документы проекта</h2><div className="mt-3 space-y-2">{publicDocuments.map((document, index) => <a key={`${document.name}-${index}`} href={document.src} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold hover:bg-secondary"><span className="min-w-0 truncate">{document.name}</span><ExternalLink className="h-4 w-4 shrink-0 text-primary" /></a>)}</div></section>}
        <h2 className="mt-7 font-black">Выполненные работы</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">{project.works?.filter((work) => work.quantity !== undefined).map((work) => <div key={work.workId || work.title} className="flex justify-between gap-3 border-b border-border px-4 py-3 text-sm"><span>{work.title}<small className="block text-muted-foreground">{work.quantity} {work.unit} × {money(work.unitPrice || work.totalPrice / Math.max(1, work.quantity))}</small></span><b>{money(work.totalPrice)}</b></div>)}</div>
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Итоговая смета</p><p className="mt-1 text-2xl font-black text-primary">{money(project.finalTotal ?? project.total ?? project.calculatedTotal ?? 0)}</p>{review && <section className="mt-6 border-t border-border pt-5"><h2 className="font-black">Отзыв клиента</h2><p className="mt-2 flex items-center gap-1 text-sm font-bold text-primary"><Star className="h-4 w-4 fill-current" />{review.rating}/5</p><p className="mt-2 text-sm text-muted-foreground">{review.reviewText}</p></section>}</aside>
    </div>
    {openIndex !== null && <div onClick={() => setOpenIndex(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"><button onClick={(event) => { event.stopPropagation(); setOpenIndex(null); }} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"><X /></button>{photos.length > 1 && <button onClick={(event) => { event.stopPropagation(); setOpenIndex((openIndex + photos.length - 1) % photos.length); }} className="absolute left-4 rounded-full bg-white/10 p-2 text-white"><ChevronLeft /></button>}<img onClick={(event) => event.stopPropagation()} src={photos[openIndex]} alt={project.title} className="max-h-[90vh] max-w-[95vw] object-contain" />{photos.length > 1 && <button onClick={(event) => { event.stopPropagation(); setOpenIndex((openIndex + 1) % photos.length); }} className="absolute right-4 rounded-full bg-white/10 p-2 text-white"><ChevronRight /></button>}<span className="absolute bottom-5 rounded bg-black/40 px-2 py-1 text-sm text-white">{openIndex + 1} из {photos.length}</span></div>}
  </div>;
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getProjectCoverPhoto, getPublishedProjects, PROJECTS_CHANGED_EVENT, PROJECTS_STORAGE_KEY } from '../lib/projectsStorage';
const money = (value) => `${Math.round(value || 0).toLocaleString('ru-RU')} ₽`;
const PAGE_SIZE = 12;

const appendUnique = (current, next) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  next.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const { items, hasMore: more } = await getPublishedProjects(0, PAGE_SIZE - 1);
        if (!active) return;
        setProjects(items);
        setNextOffset(items.length);
        setHasMore(more);
        setLoadError(false);
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    const onStorage = (event) => { if (event.key === PROJECTS_STORAGE_KEY) refresh(); };
    refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(PROJECTS_CHANGED_EVENT, refresh);
    return () => { active = false; window.removeEventListener('storage', onStorage); window.removeEventListener(PROJECTS_CHANGED_EVENT, refresh); };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setLoadMoreError(false);
    try {
      const from = nextOffset;
      const { items, hasMore: more } = await getPublishedProjects(from, from + PAGE_SIZE - 1);
      setProjects((current) => appendUnique(current, items));
      setNextOffset(from + items.length);
      setHasMore(more);
    } catch {
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return <div className="page-shell py-7 sm:py-10"><div className="mb-5"><p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Портфолио</p><h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Проекты</h1><p className="max-w-2xl text-sm text-muted-foreground">Завершённые объекты, фотографии работ и итоговая стоимость.</p></div>{loading ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Загрузка...</div> : loadError ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Не удалось загрузить данные. Попробуйте обновить страницу.</div> : projects.length ? <><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => { const coverPhoto = getProjectCoverPhoto(project); return <article key={project.id} className="rb-card rb-card-action overflow-hidden rounded-2xl">{coverPhoto && <div className="aspect-[16/9] bg-secondary/60 p-3"><img src={coverPhoto} alt={project.title} loading="lazy" decoding="async" className="h-full w-full object-contain object-center" /></div>}<div className="p-5"><div className="text-xs"><p className="font-semibold text-foreground">{project.clientName || 'Клиент не указан'}</p>{project.location && <p className="mt-1 flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />{project.location}</p>}</div><h2 className="mt-2 text-lg font-black">{project.title}</h2><p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{project.description || 'Описание не добавлено'}</p><div className="mt-4 flex items-center justify-between text-xs"><b className="text-primary">{money(project.finalTotal ?? project.total ?? project.calculatedTotal ?? 0)}</b><span>{project.deadline || 'Срок не указан'}</span></div><Link to={`/projects/${project.id}`} className="mt-5 block rounded-xl border border-primary/30 py-2.5 text-center text-xs font-bold hover:bg-primary/5">Посмотреть проект</Link></div></article>; })}</div>{loadMoreError && <p className="mt-4 text-center text-sm text-muted-foreground">Не удалось загрузить данные. Попробуйте ещё раз.</p>}{hasMore && <div className="mt-6 text-center"><button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loadingMore ? 'Загрузка...' : 'Показать ещё'}</button></div>}</> : <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Проектов пока нет.</div>}</div>;
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { getProjectCoverPhoto, getPublishedProjects, PROJECTS_CHANGED_EVENT, PROJECTS_STORAGE_KEY } from '../lib/projectsStorage';
const money = (value) => `${Math.round(value || 0).toLocaleString('ru-RU')} ₽`;
const PAGE_SIZE = 12;

const appendUnique = (current, next) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  next.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
};

const projectImageAlt = (project) => {
  const place = project.location ? `, ${project.location}` : ', Саратов';
  return `${project.title} — выполненный ремонт или строительные работы${place} | РБ Решаем Быстро`;
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

  return <div className="page-shell py-7 sm:py-10"><div className="mb-5"><p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Портфолио</p><h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Проекты</h1><p className="max-w-2xl text-sm text-muted-foreground">Завершённые объекты, фотографии ремонта и строительных работ в Саратове, выполненные работы и итоговая стоимость.</p></div>{loading ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Загрузка...</div> : loadError ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Не удалось загрузить данные. Попробуйте обновить страницу.</div> : projects.length ? <><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => { const coverPhoto = getProjectCoverPhoto(project); return <article key={project.id} className="rb-card group flex flex-col overflow-hidden rounded-2xl">{coverPhoto && <div className="relative aspect-[16/10] overflow-hidden bg-secondary/60"><img src={coverPhoto} alt={projectImageAlt(project)} loading="lazy" decoding="async" width="960" height="600" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" /><b className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1.5 font-mono text-xs text-primary shadow-lg">{money(project.finalTotal ?? project.total ?? project.calculatedTotal ?? 0)}</b></div>}<div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3 text-xs"><div><p className="font-semibold text-foreground">{project.clientName || 'Клиент не указан'}</p>{project.location && <p className="mt-1 flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />{project.location}</p>}</div><span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground"><Clock3 className="h-3 w-3" />{project.deadline || 'Срок не указан'}</span></div><h2 className="mt-3 text-lg font-black">{project.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.description || 'Описание не добавлено'}</p><Link to={`/projects/${project.id}`} className="mt-auto flex items-center justify-center gap-2 pt-5" aria-label={`Открыть проект ${project.title}`}><span className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white">Посмотреть проект <ArrowUpRight className="h-4 w-4" /></span></Link></div></article>; })}</div>{loadMoreError && <p className="mt-4 text-center text-sm text-muted-foreground">Не удалось загрузить данные. Попробуйте ещё раз.</p>}{hasMore && <div className="mt-6 text-center"><button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loadingMore ? 'Загрузка...' : 'Показать ещё'}</button></div>}</> : <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Проектов пока нет.</div>}</div>;
}

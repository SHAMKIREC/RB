import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getProjectCoverPhoto, getPublishedProjects, PROJECTS_CHANGED_EVENT, PROJECTS_STORAGE_KEY } from '../lib/projectsStorage';
const money = (value) => `${Math.round(value || 0).toLocaleString('ru-RU')} ₽`;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const refresh = async () => setProjects(await getPublishedProjects());
    const onStorage = (event) => { if (event.key === PROJECTS_STORAGE_KEY) refresh(); };
    refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(PROJECTS_CHANGED_EVENT, refresh);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(PROJECTS_CHANGED_EVENT, refresh); };
  }, []);
  return <div className="page-shell py-7 sm:py-10"><div className="mb-5"><p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Портфолио</p><h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Проекты</h1><p className="max-w-2xl text-sm text-muted-foreground">Завершённые объекты, фотографии работ и итоговая стоимость.</p></div>{projects.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => { const coverPhoto = getProjectCoverPhoto(project); return <article key={project.id} className="rb-card rb-card-action overflow-hidden rounded-2xl">{coverPhoto && <div className="aspect-[16/9] bg-secondary/60 p-3"><img src={coverPhoto} alt={project.title} className="h-full w-full object-contain object-center" /></div>}<div className="p-5"><div className="text-xs"><p className="font-semibold text-foreground">{project.clientName || 'Клиент не указан'}</p>{project.location && <p className="mt-1 flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />{project.location}</p>}</div><h2 className="mt-2 text-lg font-black">{project.title}</h2><p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{project.description || 'Описание не добавлено'}</p><div className="mt-4 flex items-center justify-between text-xs"><b className="text-primary">{money(project.finalTotal ?? project.total ?? project.calculatedTotal ?? 0)}</b><span>{project.deadline || 'Срок не указан'}</span></div><Link to={`/projects/${project.id}`} className="mt-5 block rounded-xl border border-primary/30 py-2.5 text-center text-xs font-bold hover:bg-primary/5">Посмотреть проект</Link></div></article>; })}</div> : <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Проектов пока нет.</div>}</div>;
}

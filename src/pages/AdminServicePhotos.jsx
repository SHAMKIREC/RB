import { useEffect, useMemo, useState } from 'react';
import { Images, Save } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import PhotoUploader from '../components/PhotoUploader';
import { SERVICES_CATALOG } from '../lib/servicesCatalog';
import { getAllServiceGalleries, saveServiceGallery } from '../lib/serviceGalleryStorage';

const galleryEntries = () => SERVICES_CATALOG.flatMap((category) => (
  category.direct
    ? [{ key: category.id, category: category.name, title: category.name }]
    : category.subcategories.map((subcategory) => ({
      key: subcategory.id,
      category: category.name,
      title: subcategory.name,
    }))
));

export default function AdminServicePhotos() {
  return <AdminGate><Content /></AdminGate>;
}

function Content() {
  const entries = useMemo(galleryEntries, []);
  const [galleries, setGalleries] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllServiceGalleries()
      .then(setGalleries)
      .catch(() => setMessage('Не удалось загрузить фотографии услуг.'))
      .finally(() => setLoading(false));
  }, []);

  const save = async (entry) => {
    setSavingKey(entry.key);
    setMessage('');
    try {
      const photos = await saveServiceGallery(entry.key, galleries[entry.key] || []);
      setGalleries((current) => ({ ...current, [entry.key]: photos }));
      setMessage(`Фотографии «${entry.title}» сохранены.`);
    } catch (error) {
      setMessage(error?.message || 'Не удалось сохранить фотографии.');
    } finally {
      setSavingKey('');
    }
  };

  const categories = entries.reduce((groups, entry) => ({
    ...groups,
    [entry.category]: [...(groups[entry.category] || []), entry],
  }), {});

  return <main className="page-shell py-7 text-foreground sm:py-10">
    <div className="mb-6">
      <p className="text-xs font-mono font-black uppercase tracking-widest text-primary dark:text-orange-300">Администрирование</p>
      <h1 className="mt-1 text-3xl font-black text-foreground dark:text-white">Фото услуг</h1>
      <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground dark:text-slate-300">Добавляйте реальные фотографии выполненных работ. Они появятся под прайсом выбранного раздела в указанном порядке.</p>
    </div>
    {message && <p className="mb-4 rounded-xl border border-primary/35 bg-primary/10 px-4 py-3 text-sm font-bold text-foreground dark:border-orange-400/40 dark:bg-orange-400/10 dark:text-slate-100">{message}</p>}
    {loading ? <p className="text-sm font-semibold text-muted-foreground dark:text-slate-300">Загрузка...</p> : <div className="space-y-5">
      {Object.entries(categories).map(([category, categoryEntries]) => <section key={category} className="rounded-2xl border border-border bg-card p-3 text-foreground shadow-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 sm:p-5">
        <h2 className="mb-3 text-xl font-black text-foreground dark:text-white">{category}</h2>
        <div className="space-y-3">
          {categoryEntries.map((entry) => <details key={entry.key} className="rounded-xl border border-primary/25 bg-background p-3 dark:border-orange-400/30 dark:bg-slate-950/70" open={['demolition','floors','walls'].includes(entry.key)}>
            <summary className="cursor-pointer font-bold text-foreground dark:text-slate-100">{entry.title} <span className="font-semibold text-muted-foreground dark:text-slate-300">({(galleries[entry.key] || []).length} фото)</span></summary>
            <div className="mt-3">
              <PhotoUploader value={galleries[entry.key] || []} onChange={(photos) => setGalleries((current) => ({ ...current, [entry.key]: photos }))} label="Фотографии под прайсом" labelIcon={Images} />
              <button type="button" disabled={Boolean(savingKey)} onClick={() => save(entry)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 sm:w-auto">
                <Save className="h-4 w-4" />{savingKey === entry.key ? 'Сохраняем...' : 'Сохранить фотографии'}
              </button>
            </div>
          </details>)}
        </div>
      </section>)}
    </div>}
  </main>;
}

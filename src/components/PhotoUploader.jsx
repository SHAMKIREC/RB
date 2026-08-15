import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, Trash2, X } from 'lucide-react';

export default function PhotoUploader({ value = [], onChange, label = 'Фотографии', labelIcon: LabelIcon = null, showPhotoLabels = false, photoLabels = [] }) {
  const [preview, setPreview] = useState(null);
  const ownedObjectUrls = useRef(new Set());

  useEffect(() => {
    const active = new Set(value.map((photo) => typeof photo === 'string' ? photo : photo?.src).filter((src) => src?.startsWith('blob:')));
    ownedObjectUrls.current.forEach((src) => {
      if (!active.has(src)) {
        URL.revokeObjectURL(src);
        ownedObjectUrls.current.delete(src);
      }
    });
  }, [value]);

  useEffect(() => () => {
    ownedObjectUrls.current.forEach((src) => URL.revokeObjectURL(src));
    ownedObjectUrls.current.clear();
  }, []);

  const addFiles = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
    const imageData = files.map((file) => {
      const src = URL.createObjectURL(file);
      ownedObjectUrls.current.add(src);
      return { file, name: file.name, src };
    });
    onChange([...value, ...imageData]);
    event.target.value = '';
  };

  const move = (from, direction) => {
    const to = from + direction;
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  const remove = (index) => {
    const src = typeof value[index] === 'string' ? value[index] : value[index]?.src;
    if (src?.startsWith('blob:') && ownedObjectUrls.current.has(src)) {
      URL.revokeObjectURL(src);
      ownedObjectUrls.current.delete(src);
    }
    setPreview((current) => current === index ? null : current > index ? current - 1 : current);
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return <section className="rb-card-panel rounded-2xl p-4">
    <h2 className="flex items-center gap-1.5 font-black">{LabelIcon && <LabelIcon className="h-4 w-4 text-primary" />}{label}</h2>
    <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/45 bg-primary/5 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10">
      <ImagePlus className="h-4 w-4" />Добавить фотографии
      <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} />
    </label>
    {value.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {value.map((photo, index) => { const src = typeof photo === 'string' ? photo : photo?.src || ''; return <div key={`${src.slice(0, 24)}-${index}`} className="rb-card group relative overflow-hidden rounded-xl p-2">
        <button type="button" onClick={() => setPreview(index)} className="block aspect-[4/3] w-full bg-secondary/60"><img src={src} alt={`Фото ${index + 1}`} className="h-full w-full object-contain object-center" /></button>
        <div className="absolute left-3 top-3 flex gap-1"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Переместить фотографию назад" className="rounded-lg bg-white/90 p-1.5 text-foreground shadow-sm disabled:opacity-40 dark:bg-card/95 dark:shadow-black/40"><ChevronLeft className="h-3.5 w-3.5" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} aria-label="Переместить фотографию вперёд" className="rounded-lg bg-white/90 p-1.5 text-foreground shadow-sm disabled:opacity-40 dark:bg-card/95 dark:shadow-black/40"><ChevronRight className="h-3.5 w-3.5" /></button></div>
        <button type="button" onClick={() => remove(index)} aria-label="Удалить фотографию" className="absolute right-3 top-3 rounded-lg bg-white/90 p-1.5 text-destructive shadow-sm dark:bg-card/95 dark:shadow-black/40"><Trash2 className="h-3.5 w-3.5" /></button>
        {showPhotoLabels && <p className="mt-2 truncate text-[11px] font-medium text-muted-foreground">{photoLabels[index] || `Фото ${index + 1}`}</p>}
      </div>})}
    </div>}
    {preview !== null && <div onClick={() => setPreview(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"><button type="button" onClick={() => setPreview(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"><X className="h-5 w-5" /></button><img onClick={(event) => event.stopPropagation()} src={typeof value[preview] === 'string' ? value[preview] : value[preview]?.src} alt="Просмотр фотографии" className="max-h-[90vh] max-w-[95vw] object-contain" /></div>}
  </section>;
}

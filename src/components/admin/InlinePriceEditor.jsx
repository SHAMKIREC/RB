import { useState } from 'react';
import { Pencil } from 'lucide-react';

export default function InlinePriceEditor({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [nextValue, setNextValue] = useState(String(value ?? ''));

  if (!editing) return <button type="button" onClick={() => { setNextValue(String(value ?? '')); setEditing(true); }} className="mt-1 inline-flex items-center gap-1 rounded-md border border-primary/30 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5"><Pencil className="h-3 w-3" />Изменить</button>;

  return <div className="mt-2 rounded-lg border border-primary/30 bg-primary/5 p-2 text-left">
    <p className="text-[10px] text-muted-foreground">Текущая цена: {Number(value || 0).toLocaleString('ru-RU')} ₽</p>
    <label className="mt-1 block text-[10px] font-bold text-foreground">Новая цена<input type="number" min="0" step="1" value={nextValue} onChange={(event) => setNextValue(event.target.value)} className="mt-1 block w-full rounded-md border border-border bg-background px-2 py-1 text-xs font-normal" /></label>
    <div className="mt-2 flex gap-2"><button type="button" onClick={() => { if (onSave(nextValue)) setEditing(false); }} className="rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-white">Сохранить</button><button type="button" onClick={() => setEditing(false)} className="rounded-md border border-border px-2 py-1 text-[10px] font-bold">Отмена</button></div>
  </div>;
}

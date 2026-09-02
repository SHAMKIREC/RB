import { useEffect, useMemo, useState } from 'react';
import { Copy, KeyRound, RotateCcw, Search, ShieldCheck, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { createRbProCode, deleteRbProCode, listRbProCodes, resetRbProDevice, setRbProCodeActive } from '../lib/rbProAccess';

const PAGE_SIZE = 8;
const dateText = (value) => value ? new Date(value).toLocaleString('ru-RU') : '—';
const masterName = (item) => `Мастер ${String(Number(item?.master_number) || 0).padStart(5, '0')}`;
const accessTitle = (item) => item?.label ? `${masterName(item)} · ${item.label}` : masterName(item);

export default function AdminRbPro() {
  return <AdminGate><Content /></AdminGate>;
}

function Content() {
  const [codes, setCodes] = useState([]);
  const [label, setLabel] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newMaster, setNewMaster] = useState('');
  const [busyId, setBusyId] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const refresh = async () => setCodes(await listRbProCodes());

  useEffect(() => {
    refresh().catch((e) => setError(e?.message || 'Не удалось загрузить коды.'));
  }, []);

  const filteredCodes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return codes.filter((item) => {
      if (filter === 'active' && !item.active) return false;
      if (filter === 'disabled' && item.active) return false;
      if (!normalized) return true;
      return accessTitle(item).toLowerCase().includes(normalized);
    });
  }, [codes, filter, query]);

  const pages = Math.max(1, Math.ceil(filteredCodes.length / PAGE_SIZE));
  const visibleCodes = filteredCodes.slice((Math.min(page, pages) - 1) * PAGE_SIZE, Math.min(page, pages) * PAGE_SIZE);

  useEffect(() => setPage(1), [filter, query]);

  const create = async () => {
    setCreating(true);
    setError('');
    setNewCode('');
    setNewMaster('');
    try {
      const result = await createRbProCode(label.trim());
      setNewCode(result.code);
      setNewMaster(`Мастер ${String(Number(result.master_number) || 0).padStart(5, '0')}`);
      setLabel('');
      await refresh();
    } catch (e) {
      setError(e?.message || 'Не удалось создать код.');
    } finally {
      setCreating(false);
    }
  };

  const runItemAction = async (item, action, fallback) => {
    setBusyId(item.id);
    setError('');
    try {
      await action();
      await refresh();
    } catch (e) {
      setError(e?.message || fallback);
    } finally {
      setBusyId('');
    }
  };

  const toggle = (item) => runItemAction(item, () => setRbProCodeActive(item.id, !item.active), 'Не удалось изменить код.');
  const resetDevice = (item) => runItemAction(item, () => resetRbProDevice(item.id), 'Не удалось сбросить устройство.');
  const remove = async (item) => {
    const title = accessTitle(item);
    if (!window.confirm(`Удалить доступ «${title}» навсегда? Код и все его сессии перестанут работать.`)) return;
    await runItemAction(item, () => deleteRbProCode(item.id), 'Не удалось удалить доступ.');
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(newCode); } catch { /* manual copy remains available */ }
  };

  return <main className="page-shell py-6 sm:py-10">
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary p-3 text-white"><KeyRound className="h-6 w-6" /></div>
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">RB PRO</p><h1 className="text-2xl font-black sm:text-3xl">Доступ мастеров</h1></div>
      </div>

      <section className="mt-5 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><p className="text-sm text-muted-foreground">Каждый новый доступ автоматически получает постоянный номер «Мастер 00001», «Мастер 00002» и далее. Дополнительную пометку можно оставить для себя.</p></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block text-sm font-bold">Дополнительная пометка <span className="font-normal text-muted-foreground">(необязательно)</span><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Например: плиточник / Энгельс" className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-3 font-normal" /></label>
          <button type="button" onClick={create} disabled={creating} className="h-[46px] rounded-xl bg-primary px-5 text-sm font-black text-white disabled:opacity-60">{creating ? 'Создаю…' : 'Создать код'}</button>
        </div>
        {newCode && <div className="mt-4 rounded-2xl border border-green-300 bg-green-50 p-4 text-green-950 dark:border-green-700 dark:bg-green-950/30 dark:text-green-100"><p className="text-xs font-bold uppercase tracking-wider">{newMaster || 'Новый мастер'} — отправьте код сейчас</p><div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 break-all text-lg font-black">{newCode}</code><button type="button" onClick={copy} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-600 text-white"><Copy className="h-4 w-4" /></button></div></div>}
        {error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-black">Список доступов</h2><p className="text-xs text-muted-foreground">Всего: {codes.length} · показано: {filteredCodes.length}</p></div>
          <div className="flex rounded-xl border border-border bg-background p-1 text-xs font-bold">
            {[['all','Все'],['active','Активные'],['disabled','Отключённые']].map(([value, text]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 ${filter === value ? 'bg-primary text-white' : 'text-muted-foreground'}`}>{text}</button>)}
          </div>
        </div>

        <label className="relative mt-4 block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по номеру или пометке" className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm" /></label>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          {visibleCodes.length ? visibleCodes.map((item, index) => {
            const linked = (item.active_sessions || 0) > 0;
            const isBusy = busyId === item.id;
            return <div key={item.id} className={`bg-background p-3 sm:p-4 ${index ? 'border-t border-border' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="truncate font-black">{masterName(item)}</p><span className={`rounded-full px-2 py-1 text-[10px] font-black ${item.active ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-secondary text-muted-foreground'}`}>{item.active ? 'АКТИВЕН' : 'ОТКЛЮЧЁН'}</span></div>
                  {item.label && <p className="mt-0.5 truncate text-xs font-semibold text-foreground/75">{item.label}</p>}
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Создан {dateText(item.created_at)} · вход {dateText(item.last_used_at)} · {linked ? 'устройство привязано' : 'без устройства'}</p>
                </div>
                <button type="button" disabled={isBusy} onClick={() => remove(item)} title="Удалить доступ" aria-label="Удалить доступ" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-red-500/20 text-red-500 transition hover:bg-red-500/10 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={isBusy} onClick={() => toggle(item)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black ${item.active ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-secondary text-foreground'}`}>{item.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}{item.active ? 'Отключить' : 'Включить'}</button>
                {linked && <button type="button" disabled={isBusy} onClick={() => resetDevice(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-black transition hover:bg-secondary disabled:opacity-40"><RotateCcw className="h-4 w-4" />Сбросить устройство</button>}
              </div>
            </div>;
          }) : <p className="p-6 text-center text-sm text-muted-foreground">Ничего не найдено.</p>}
        </div>

        {pages > 1 && <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-border px-3 py-2 disabled:opacity-30">Назад</button><span className="text-muted-foreground">{Math.min(page, pages)} / {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage((value) => Math.min(pages, value + 1))} className="rounded-lg border border-border px-3 py-2 disabled:opacity-30">Дальше</button></div>}
      </section>
    </div>
  </main>;
}

import { useEffect, useState } from 'react';
import { Copy, KeyRound, RotateCcw, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { createRbProCode, listRbProCodes, resetRbProDevice, setRbProCodeActive } from '../lib/rbProAccess';

const dateText = (value) => value ? new Date(value).toLocaleString('ru-RU') : '—';

export default function AdminRbPro() {
  return <AdminGate><Content /></AdminGate>;
}

function Content() {
  const [codes, setCodes] = useState([]);
  const [label, setLabel] = useState('');
  const [newCode, setNewCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => setCodes(await listRbProCodes());

  useEffect(() => {
    refresh().catch((e) => setError(e?.message || 'Не удалось загрузить коды.'));
  }, []);

  const create = async () => {
    setBusy(true);
    setError('');
    setNewCode('');
    try {
      const result = await createRbProCode(label.trim());
      setNewCode(result.code);
      setLabel('');
      await refresh();
    } catch (e) {
      setError(e?.message || 'Не удалось создать код.');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (item) => {
    setBusy(true);
    setError('');
    try {
      await setRbProCodeActive(item.id, !item.active);
      await refresh();
    } catch (e) {
      setError(e?.message || 'Не удалось изменить код.');
    } finally {
      setBusy(false);
    }
  };

  const resetDevice = async (item) => {
    setBusy(true);
    setError('');
    try {
      await resetRbProDevice(item.id);
      await refresh();
    } catch (e) {
      setError(e?.message || 'Не удалось сбросить устройство.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(newCode); } catch { /* manual copy remains available */ }
  };

  return <main className="page-shell py-8 sm:py-12">
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary p-3 text-white"><KeyRound className="h-6 w-6" /></div>
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">RB PRO</p><h1 className="text-2xl font-black sm:text-3xl">Доступ мастеров</h1></div>
      </div>

      <section className="mt-7 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><p className="text-sm text-muted-foreground">После одобрения мастера в Telegram создайте для него отдельный код. Один код можно активировать только на одном устройстве. Сам код показывается только один раз, а в базе хранится только его хэш.</p></div>
        <label className="mt-5 block text-sm font-bold">Внутренняя пометка <span className="font-normal text-muted-foreground">(необязательно, без ФИО и телефона)</span><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Например: Мастер 001" className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-3 font-normal" /></label>
        <button type="button" onClick={create} disabled={busy} className="mt-4 w-full rounded-2xl bg-primary px-5 py-3 font-black text-white disabled:opacity-60">{busy ? 'Подождите…' : 'Создать индивидуальный код'}</button>
        {newCode && <div className="mt-4 rounded-2xl border border-green-300 bg-green-50 p-4 text-green-950 dark:border-green-700 dark:bg-green-950/30 dark:text-green-100"><p className="text-xs font-bold uppercase tracking-wider">Отправьте мастеру сейчас</p><div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 break-all text-lg font-black">{newCode}</code><button type="button" onClick={copy} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-600 text-white"><Copy className="h-4 w-4" /></button></div><p className="mt-2 text-xs opacity-75">После первой активации код привяжется к одному устройству. Для переноса на другой телефон сначала нажмите «Сбросить устройство».</p></div>}
        {error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <h2 className="font-black">Выданные доступы</h2>
        <div className="mt-4 space-y-3">
          {codes.length ? codes.map((item) => <div key={item.id} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1"><p className="font-black">{item.label || 'Без пометки'}</p><p className="mt-1 text-xs text-muted-foreground">Создан: {dateText(item.created_at)} · Последний вход: {dateText(item.last_used_at)} · Устройство: {(item.active_sessions || 0) > 0 ? 'привязано' : 'не привязано'}</p></div>
              <button type="button" disabled={busy} onClick={() => toggle(item)} title={item.active ? 'Отключить доступ' : 'Включить доступ'} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${item.active ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-secondary text-muted-foreground'}`}>{item.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}{item.active ? 'Активен' : 'Отключён'}</button>
            </div>
            {(item.active_sessions || 0) > 0 && <button type="button" disabled={busy} onClick={() => resetDevice(item)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-black text-foreground transition hover:bg-secondary disabled:opacity-60"><RotateCcw className="h-4 w-4" />Сбросить устройство</button>}
          </div>) : <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Коды ещё не создавались.</p>}
        </div>
      </section>
    </div>
  </main>;
}

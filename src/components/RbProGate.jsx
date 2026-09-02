import { useEffect, useState } from 'react';
import { KeyRound, LockKeyhole, Send, ShieldCheck } from 'lucide-react';
import { RB_PRO_TELEGRAM_URL, rbProCheckAccess, rbProLogin } from '../lib/rbProAccess';

export default function RbProGate({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    rbProCheckAccess().then((ok) => { if (active) setAllowed(ok); }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError('');
    try {
      await rbProLogin(code.trim());
      setAllowed(true);
    } catch (e) {
      setError(e?.message || 'Код не подошёл.');
    } finally {
      setBusy(false);
    }
  };

  if (checking) return <div className="page-shell py-16"><div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">Проверяем доступ RB PRO…</div></div>;
  if (allowed) return children;

  return <main className="page-shell py-8 sm:py-12">
    <section className="mx-auto max-w-2xl overflow-hidden rounded-[30px] border border-orange-300/40 bg-card shadow-[0_24px_70px_-36px_rgba(234,88,12,.55)]">
      <div className="relative overflow-hidden bg-[#242321] px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500"><LockKeyhole className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[.2em] text-orange-300">Закрытый раздел</p><h1 className="text-3xl font-black">RB PRO</h1></div></div>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">Заказы и предложения для проверенных мастеров. Сначала подайте заявку в закрытую Telegram-группу. После одобрения администратор выдаст индивидуальный код доступа.</p>
        </div>
      </div>

      <div className="p-6 sm:p-9">
        <a href={RB_PRO_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-5 py-4 font-black text-white shadow-lg shadow-sky-500/15"><Send className="h-5 w-5" />Подать заявку в Telegram</a>

        <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">уже приняли?</span><span className="h-px flex-1 bg-border" /></div>

        <form onSubmit={submit}>
          <label className="text-sm font-black">Код мастера<input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} autoCapitalize="characters" autoComplete="off" spellCheck="false" placeholder="RB-XXXX-XXXX-XXXX-XXXX" className="mt-2 block w-full rounded-2xl border border-border bg-background px-4 py-4 font-mono text-base font-bold uppercase tracking-wide outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
          <button disabled={busy || !code.trim()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-black text-white disabled:opacity-50"><KeyRound className="h-5 w-5" />{busy ? 'Проверяем…' : 'Открыть RB PRO'}</button>
        </form>
        {error && <p className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}

        <div className="mt-6 flex gap-3 rounded-2xl bg-secondary/70 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><p className="text-xs leading-relaxed text-muted-foreground">Для доступа сайт не просит ФИО, телефон или e-mail. Код сохраняется на этом устройстве на ограниченный срок и может быть отключён администратором.</p></div>
      </div>
    </section>
  </main>;
}

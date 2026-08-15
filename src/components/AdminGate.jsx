import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, LogOut, Ruler, Wrench } from 'lucide-react';
import adminBuilderLeft from '@/assets/images/admin/admin-builder-left.png';
import adminBuilderRight from '@/assets/images/admin/admin-builder-right.png';
import { endAdminSession, isAdminSessionActive, startAdminSession, subscribeToAdminSession } from '../lib/adminSession';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { enableInlineEditMode } from '../lib/pricingStorage';

export function AdminNavigation({ onExit }) {
  return <div className="border-b border-border bg-card/95"><div className="page-shell flex flex-wrap items-center gap-x-3 gap-y-2 py-2 text-xs font-bold sm:gap-3"><span className="text-muted-foreground">Администрирование:</span><Link to="/admin/orders" className="hover:text-primary">Заказы</Link><Link to="/admin/projects" className="hover:text-primary">Проекты</Link><Link to="/admin/reviews" className="hover:text-primary">Отзывы</Link><Link to="/" onClick={enableInlineEditMode} className="basis-full hover:text-primary sm:basis-auto">Открыть сайт</Link><button onClick={onExit} className="ml-auto inline-flex items-center gap-1 text-destructive"><LogOut className="h-3.5 w-3.5"/>Выйти</button></div></div>;
}

export default function AdminGate({ children }) {
  const [allowed, setAllowed] = useState(false); const [loading, setLoading] = useState(true); const [pin, setPin] = useState(''); const [error, setError] = useState('');
  const configured = isSupabaseConfigured && Boolean(import.meta.env.VITE_ADMIN_EMAIL);
  useEffect(() => {
    let active = true;
    isAdminSessionActive()
      .then((isAllowed) => { if (active) setAllowed(isAllowed); })
      .catch(() => { if (active) { setAllowed(false); setError('Не удалось проверить доступ. Попробуйте ещё раз.'); } })
      .finally(() => { if (active) setLoading(false); });
    const unsubscribe = subscribeToAdminSession(
      (isAllowed) => { if (active) { setAllowed(isAllowed); setLoading(false); } },
      () => { if (active) setError('Не удалось проверить доступ. Попробуйте ещё раз.'); },
    );
    return () => { active = false; unsubscribe(); };
  }, []);
  if (loading) return <div className="page-shell py-12" />;
  if (allowed) return <><AdminNavigation onExit={async () => { try { await endAdminSession(); setAllowed(false); } catch { setError('Не удалось завершить сессию. Попробуйте ещё раз.'); } }} />{children}</>;
  return (
    <section className="relative isolate overflow-hidden">
      <Ruler aria-hidden="true" className="pointer-events-none absolute left-[7%] top-16 hidden h-24 w-24 -rotate-12 text-primary opacity-[0.07] md:block" />
      <Wrench aria-hidden="true" className="pointer-events-none absolute right-[8%] top-20 hidden h-20 w-20 rotate-12 text-primary opacity-[0.06] md:block" />
      <Crown aria-hidden="true" className="pointer-events-none absolute bottom-16 left-1/2 hidden h-24 w-24 -translate-x-1/2 rotate-6 text-primary opacity-[0.04] lg:block" />

      <div className="page-shell grid min-h-[520px] items-end py-14 sm:min-h-[560px] sm:py-16 min-[1200px]:min-h-[600px] min-[1200px]:grid-cols-[minmax(240px,1fr)_minmax(420px,500px)_minmax(240px,1fr)] min-[1200px]:gap-5 min-[1200px]:py-10 2xl:gap-8">
        <figure className="relative hidden h-[430px] min-w-0 items-end justify-center min-[1200px]:flex 2xl:h-[470px]">
          <img
            src={adminBuilderLeft}
            alt=""
            className="h-full w-full object-contain object-bottom"
          />
          <figcaption className="absolute bottom-5 right-0 max-w-[190px] -rotate-3 text-center font-serif text-lg italic leading-tight text-amber-800/70 2xl:right-2">
            Мы строим — Вы отдыхаете
          </figcaption>
        </figure>

        <div className="relative z-10 mx-auto w-full max-w-[500px] pt-10 min-[1200px]:self-center">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700/70">
            Вход только для Короля
          </p>
          <div className="relative rounded-2xl border border-amber-500/60 bg-white px-5 pb-6 pt-9 text-slate-900 shadow-[0_24px_60px_-24px_rgba(120,53,15,0.42)] sm:px-7 sm:pb-7 sm:pt-10">
            <div className="absolute left-1/2 top-0 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-[58%] items-center justify-center rounded-full border border-amber-400/45 bg-white shadow-[0_0_28px_rgba(245,158,11,0.24)]">
              <Crown aria-hidden="true" className="h-12 w-12 fill-amber-400/20 text-amber-500" strokeWidth={1.8} />
            </div>

            <h1 className="text-center text-2xl font-black sm:text-[28px]">Вход владельца сайта</h1>
            <div className="mx-auto mt-3 flex w-28 items-center gap-2" aria-hidden="true">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="h-1.5 w-1.5 rotate-45 border border-amber-500" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            <p className="mt-3 text-center text-sm text-slate-500">Доступ только для владельца 👑</p>

            {!configured ? <p className="mt-4 text-center text-sm text-destructive">Административный доступ не настроен.</p> : <form onSubmit={async (event) => { event.preventDefault(); setError(''); try { const ok = await startAdminSession(pin); if (ok) setAllowed(true); else setError('Неверный PIN.'); } catch { setError('Не удалось выполнить вход. Попробуйте ещё раз.'); } }} className="mt-6 space-y-3">
              <div className="relative">
                <input value={pin} onChange={(event) => setPin(event.target.value)} type="password" inputMode="text" autoCapitalize="none" autoCorrect="off" className="w-full rounded-xl border border-amber-300/70 bg-white px-3 py-2.5 pr-11 outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="PIN"/>
                <Crown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500/75" strokeWidth={1.8} />
              </div>
              <button className="group relative w-full overflow-hidden rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30">
                <span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-[430%]" />
                <span className="relative">👑 Войти как Король</span>
              </button>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </form>}
          </div>
        </div>

        <figure className="relative hidden h-[430px] min-w-0 items-end justify-center min-[1200px]:flex 2xl:h-[470px]">
          <img
            src={adminBuilderRight}
            alt=""
            className="h-full w-full object-contain object-bottom"
          />
          <figcaption className="absolute bottom-5 left-0 max-w-[190px] rotate-3 text-center font-serif text-lg italic leading-tight text-amber-800/70 2xl:left-2">
            Качество в каждой детали
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

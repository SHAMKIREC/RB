import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, LogOut } from 'lucide-react';
import adminBuilderLeft from '@/assets/images/admin/admin-builder-left.png';
import adminBuilderRight from '@/assets/images/admin/admin-builder-right.png';
import adminLoginBackground from '@/assets/images/admin/admin-login-background.png';
import adminLoginFrame from '@/assets/images/admin/admin-login-frame.png';
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
    <section className="relative isolate min-h-[540px] overflow-hidden bg-[#d9c1a3] sm:min-h-[570px] lg:min-h-[590px] xl:min-h-[610px]">
      <img
        src={adminLoginBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center xl:object-fill"
      />
      <div className="absolute inset-0 bg-white/5 md:bg-transparent" aria-hidden="true" />

      <img
        src={adminBuilderLeft}
        alt=""
        className="pointer-events-none absolute bottom-0 z-10 hidden h-[88%] w-auto max-w-none object-contain object-bottom lg:left-[-70px] lg:block xl:left-[calc(50%-700px)] xl:h-[96%] 2xl:left-[calc(50%-735px)]"
      />
      <img
        src={adminBuilderRight}
        alt=""
        className="pointer-events-none absolute bottom-0 z-10 hidden h-[88%] w-auto max-w-none object-contain object-bottom lg:right-[-70px] lg:block xl:right-[calc(50%-700px)] xl:h-[96%] 2xl:right-[calc(50%-735px)]"
      />

      <p className="pointer-events-none absolute left-[calc(50%-420px)] top-16 z-20 hidden -rotate-6 font-serif text-2xl italic text-stone-800/75 xl:block">
        Вход только
      </p>
      <p className="pointer-events-none absolute right-[calc(50%-420px)] top-16 z-20 hidden rotate-3 font-serif text-2xl italic text-stone-800/75 xl:block">
        для Короля
      </p>
      <p className="pointer-events-none absolute bottom-24 left-[3.5%] z-20 hidden max-w-[210px] -rotate-3 text-center font-serif text-xl italic leading-tight text-stone-800/75 xl:block">
        Мы строим — Вы отдыхаете!
      </p>
      <p className="pointer-events-none absolute bottom-24 right-[3.5%] z-20 hidden max-w-[210px] rotate-3 text-center font-serif text-xl italic leading-tight text-stone-800/75 xl:block">
        Качество в каждой детали!
      </p>

      <div className="relative z-30 mx-auto flex min-h-[540px] w-full items-start justify-center px-4 pb-10 pt-40 sm:min-h-[570px] sm:px-6 sm:pt-44 lg:min-h-[590px] lg:pt-44 xl:min-h-[610px] xl:pt-48">
        <div className="relative flex min-h-[330px] w-full min-w-0 max-w-[620px] items-center justify-center text-slate-900 sm:min-h-[320px] lg:max-w-[560px] xl:max-w-[620px]">
          <div className="absolute inset-[3%] rounded-[24px] bg-white/95 shadow-[0_22px_50px_-20px_rgba(71,40,14,0.5)]" />
          <img
            src={adminLoginFrame}
            alt=""
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill"
          />

          <div className="relative z-20 w-full px-[11%] py-12 sm:px-[12%] sm:py-14">
            <h1 className="text-center text-2xl font-black tracking-tight sm:text-[30px]">Вход владельца сайта</h1>
            <p className="mt-2.5 text-center text-sm text-slate-500 sm:text-[15px]">Доступ только для владельца 👑</p>

            {!configured ? <p className="mt-5 text-center text-sm text-destructive">Административный доступ не настроен.</p> : <form onSubmit={async (event) => { event.preventDefault(); setError(''); try { const ok = await startAdminSession(pin); if (ok) setAllowed(true); else setError('Неверный PIN.'); } catch { setError('Не удалось выполнить вход. Попробуйте ещё раз.'); } }} className="mt-6 space-y-3.5">
              <div className="relative">
                <input value={pin} onChange={(event) => setPin(event.target.value)} type="password" inputMode="text" autoCapitalize="none" autoCorrect="off" className="h-12 w-full rounded-xl border border-amber-300/70 bg-[#fffdf9] px-4 pr-12 outline-none shadow-inner shadow-amber-900/5 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="PIN"/>
                <Crown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500/80" strokeWidth={1.8} />
              </div>
              <button className="group relative h-12 w-full overflow-hidden rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-orange-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/35 sm:text-base">
                <span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-[430%]" />
                <span className="relative">👑 Войти как Король</span>
              </button>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </form>}
          </div>
        </div>
      </div>
    </section>
  );
}

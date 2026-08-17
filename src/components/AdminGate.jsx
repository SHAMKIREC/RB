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
    <section data-admin-login className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden bg-[#d9c1a3] pb-[env(safe-area-inset-bottom)] sm:min-h-[calc(100dvh-5rem)] lg:min-h-[600px] xl:min-h-[620px]">
      <style>{`[data-admin-login] > p { display: block !important; color: #111827 !important; background: rgba(255,255,255,.82) !important; border-color: rgba(120,70,20,.45) !important; } [data-admin-login] > p:nth-of-type(-n+2) { top: 1rem; } [data-admin-login] > p:nth-of-type(3), [data-admin-login] > p:nth-of-type(4) { bottom: 1rem; } @media (max-width: 479px) { [data-admin-login] > p { font-size: 9px !important; padding: .35rem .5rem !important; } }`}</style>
      <img
        src={adminLoginBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center xl:object-fill"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#3b2417]/15 md:to-transparent" aria-hidden="true" />

      <img
        src={adminBuilderLeft}
        alt=""
        className="pointer-events-none absolute -left-[112px] bottom-0 z-10 block h-[52%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_20px_rgba(47,25,11,0.28)] min-[480px]:-left-[100px] min-[480px]:h-[60%] sm:-left-[85px] sm:h-[68%] md:-left-[70px] md:h-[78%] lg:h-[88%] xl:left-[calc(50%-700px)] xl:h-[96%] 2xl:left-[calc(50%-735px)]"
      />
      <img
        src={adminBuilderRight}
        alt=""
        className="pointer-events-none absolute -right-[112px] bottom-0 z-10 block h-[52%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_20px_rgba(47,25,11,0.28)] min-[480px]:-right-[100px] min-[480px]:h-[60%] sm:-right-[85px] sm:h-[68%] md:-right-[70px] md:h-[78%] lg:h-[88%] xl:right-[calc(50%-700px)] xl:h-[96%] 2xl:right-[calc(50%-735px)]"
      />

      <p className="pointer-events-none absolute left-[8%] top-7 z-20 hidden -rotate-3 rounded-full border border-white/45 bg-gradient-to-r from-orange-600/95 to-red-600/95 px-4 py-1.5 font-serif text-sm font-bold italic text-white shadow-[0_8px_22px_rgba(126,45,12,0.34)] md:block lg:left-[calc(50%-420px)] lg:top-16 lg:-rotate-6 lg:px-5 lg:text-lg xl:text-xl">
        Вход только
      </p>
      <p className="pointer-events-none absolute right-[8%] top-7 z-20 hidden rotate-3 rounded-full border border-white/45 bg-gradient-to-r from-red-600/95 to-orange-600/95 px-4 py-1.5 font-serif text-sm font-bold italic text-white shadow-[0_8px_22px_rgba(126,45,12,0.34)] md:block lg:right-[calc(50%-420px)] lg:top-16 lg:px-5 lg:text-lg xl:text-xl">
        для Короля
      </p>
      <p className="pointer-events-none absolute bottom-12 left-[2.5%] z-20 hidden max-w-[210px] -rotate-3 rounded-2xl border border-white/40 bg-gradient-to-br from-orange-600/95 to-red-700/95 px-4 py-2.5 text-center font-serif text-base font-bold italic leading-tight text-white shadow-[0_10px_26px_rgba(126,45,12,0.38)] lg:block xl:bottom-16 xl:left-[3.5%] xl:max-w-[230px] xl:text-lg">
        Мы строим — Вы отдыхаете!
      </p>
      <p className="pointer-events-none absolute bottom-12 right-[2.5%] z-20 hidden max-w-[210px] rotate-3 rounded-2xl border border-white/40 bg-gradient-to-bl from-orange-600/95 to-red-700/95 px-4 py-2.5 text-center font-serif text-base font-bold italic leading-tight text-white shadow-[0_10px_26px_rgba(126,45,12,0.38)] lg:block xl:bottom-16 xl:right-[3.5%] xl:max-w-[230px] xl:text-lg">
        Качество в каждой детали!
      </p>

      <div className="relative z-30 mx-auto flex min-h-[calc(100dvh-4rem)] w-full items-start justify-center px-2 pb-8 pt-16 min-[480px]:px-6 min-[480px]:pt-20 sm:min-h-[calc(100dvh-5rem)] sm:px-8 md:pt-28 lg:min-h-[600px] lg:pt-40 xl:min-h-[620px] xl:pt-44">
        <div className="relative flex min-h-[330px] w-full min-w-0 max-w-[430px] items-center justify-center text-slate-900 min-[480px]:min-h-[350px] min-[480px]:max-w-[500px] sm:min-h-[330px] sm:max-w-[520px] lg:min-h-[320px] lg:max-w-[560px] xl:max-w-[620px]">
          <div className="absolute inset-x-[5.75%] inset-y-[9%] overflow-hidden rounded-[18px] bg-[#fffdf9] shadow-[0_22px_50px_-20px_rgba(71,40,14,0.55)] sm:rounded-[22px]" />
          <img
            src={adminLoginFrame}
            alt=""
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill"
          />

          <div className="relative z-20 w-full px-[13%] py-11 min-[480px]:py-12 sm:px-[12%]">
            <h1 className="text-center text-[22px] font-black leading-tight tracking-tight sm:text-[28px] lg:text-[30px]">Вход владельца сайта</h1>
            <p className="mt-2 text-center text-[13px] text-slate-600 sm:mt-2.5 sm:text-[15px]">Доступ только для владельца 👑</p>

            {!configured ? <p className="mt-5 text-center text-sm text-destructive">Административный доступ не настроен.</p> : <form onSubmit={async (event) => { event.preventDefault(); setError(''); try { const ok = await startAdminSession(pin); if (ok) setAllowed(true); else setError('Неверный PIN.'); } catch { setError('Не удалось выполнить вход. Попробуйте ещё раз.'); } }} className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5">
              <div className="relative">
                <input value={pin} onChange={(event) => setPin(event.target.value)} type="password" inputMode="text" autoCapitalize="none" autoCorrect="off" className="h-11 w-full rounded-xl border border-amber-300/70 bg-white px-4 pr-12 outline-none shadow-inner shadow-amber-900/5 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-12" placeholder="PIN"/>
                <Crown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500/80" strokeWidth={1.8} />
              </div>
              <button className="group relative h-11 w-full overflow-hidden rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-orange-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/35 sm:h-12 sm:text-base">
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

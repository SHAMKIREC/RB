import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Camera, Crown, DatabaseBackup, ExternalLink, FolderKanban, LogOut, MessageSquareText, ReceiptText, ShieldCheck } from 'lucide-react';
import adminBuilderLeft from '@/assets/images/admin/admin-builder-left.png';
import adminBuilderRight from '@/assets/images/admin/admin-builder-right.png';
import adminLoginBackground from '@/assets/images/admin/admin-login-background.png';
import adminLoginFrame from '@/assets/images/admin/admin-login-frame.png';
import { endAdminSession, isAdminSessionActive, startAdminSession, subscribeToAdminSession } from '../lib/adminSession';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { enableInlineEditMode } from '../lib/pricingStorage';

export function AdminNavigation({ onExit }) {
  const items = [
    { to: '/admin/orders', label: 'Заказы', icon: ReceiptText },
    { to: '/admin/projects', label: 'Проекты', icon: FolderKanban },
    { to: '/admin/reviews', label: 'Отзывы', icon: MessageSquareText },
    { to: '/admin/service-photos', label: 'Фото услуг', icon: Camera },
    { to: '/admin/backup', label: 'Резерв', icon: DatabaseBackup },
  ];
  const itemClass = ({ isActive }) => `group relative inline-flex h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border px-3 text-xs font-black transition-all duration-300 sm:h-12 sm:px-4 ${isActive ? 'border-orange-400/70 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_9px_22px_-10px_rgba(249,82,22,.9)]' : 'border-white/10 bg-white/[.06] text-white/75 hover:-translate-y-0.5 hover:border-orange-400/45 hover:bg-white/[.11] hover:text-white'}`;
  return <div className="sticky top-0 z-50 border-b border-black/20 bg-[#242321]/95 text-white shadow-[0_12px_30px_-22px_rgba(0,0,0,.8)] backdrop-blur-xl">
    <div className="page-shell py-2.5 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-orange-400/25 bg-gradient-to-br from-orange-500/20 to-red-500/10 px-2.5 sm:h-12 sm:px-3">
          <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-[0_6px_16px_-7px_rgba(255,80,20,.9)]"><ShieldCheck className="h-4 w-4"/><span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full border border-[#242321] bg-green-400" /></span>
          <span className="hidden leading-tight min-[390px]:block"><span className="block text-[10px] uppercase tracking-[.16em] text-white/50">Панель</span><span className="block text-xs font-black">Владельца</span></span>
        </div>

        <nav aria-label="Разделы админки" className="flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={itemClass}>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Icon className="relative h-4 w-4"/><span className="relative whitespace-nowrap">{label}</span>
          </NavLink>)}
        </nav>

        <div className="flex shrink-0 gap-2">
          <Link to="/" onClick={enableInlineEditMode} aria-label="Открыть сайт" title="Открыть сайт" className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] text-white/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/45 hover:bg-white/[.11] hover:text-orange-300 sm:h-12 sm:w-auto sm:gap-2 sm:px-3">
            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6"/><span className="hidden text-xs font-black lg:inline">На сайт</span>
          </Link>
          <button type="button" onClick={onExit} aria-label="Выйти из админки" title="Выйти" className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-red-500/20 hover:text-white sm:h-12 sm:w-auto sm:gap-2 sm:px-3">
            <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"/><span className="hidden text-xs font-black xl:inline">Выйти</span>
          </button>
        </div>
      </div>
      <p className="mt-1.5 truncate px-1 text-[10px] font-medium text-white/35 sm:hidden">Проведите по разделам влево или вправо</p>
    </div>
  </div>;
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
    <section data-admin-login className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#d9c1a3] pb-[env(safe-area-inset-bottom)] sm:min-h-[calc(100svh-5rem)] lg:min-h-[600px] xl:min-h-[620px]">
      <style>{`@media (min-width: 1280px) { [data-admin-login] > p { display: block !important; color: #111827 !important; background: rgba(255,255,255,.82) !important; border-color: rgba(120,70,20,.45) !important; } [data-admin-login] > p:nth-of-type(-n+2) { top: 1rem; } [data-admin-login] > p:nth-of-type(3), [data-admin-login] > p:nth-of-type(4) { bottom: 1rem; } }`}</style>
      <img
        src={adminLoginBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center xl:object-fill"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#3b2417]/15 md:to-transparent" aria-hidden="true" />

      <img
        src={adminBuilderLeft}
        alt=""
        className="pointer-events-none absolute -left-[24px] bottom-0 z-10 block h-[51%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_20px_rgba(47,25,11,0.28)] min-[480px]:-left-[20px] min-[480px]:h-[58%] sm:-left-[16px] sm:h-[64%] md:-left-[18px] md:h-[70%] lg:-left-[32px] lg:h-[80%] xl:left-[calc(50%-700px)] xl:h-[96%] 2xl:left-[calc(50%-735px)]"
      />
      <img
        src={adminBuilderRight}
        alt=""
        className="pointer-events-none absolute -right-[24px] bottom-0 z-10 block h-[51%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_20px_rgba(47,25,11,0.28)] min-[480px]:-right-[20px] min-[480px]:h-[58%] sm:-right-[16px] sm:h-[64%] md:-right-[18px] md:h-[70%] lg:-right-[32px] lg:h-[80%] xl:right-[calc(50%-700px)] xl:h-[96%] 2xl:right-[calc(50%-735px)]"
      />

      <p className="pointer-events-none absolute left-3 top-14 z-20 block -rotate-3 rounded-full border border-white/45 bg-gradient-to-r from-orange-600/95 to-red-600/95 px-2 py-1 font-serif text-[10px] font-bold italic text-white shadow-[0_8px_22px_rgba(126,45,12,0.34)] sm:left-6 sm:top-16 sm:px-3 sm:text-xs lg:left-[8%] lg:top-20 lg:text-sm xl:left-[calc(50%-420px)] xl:top-16 xl:-rotate-6 xl:px-5 xl:py-1.5 xl:text-xl">
        Вход только
      </p>
      <p className="pointer-events-none absolute right-3 top-14 z-20 block rotate-3 rounded-full border border-white/45 bg-gradient-to-r from-red-600/95 to-orange-600/95 px-2 py-1 font-serif text-[10px] font-bold italic text-white shadow-[0_8px_22px_rgba(126,45,12,0.34)] sm:right-6 sm:top-16 sm:px-3 sm:text-xs lg:right-[8%] lg:top-20 lg:text-sm xl:right-[calc(50%-420px)] xl:top-16 xl:px-5 xl:py-1.5 xl:text-xl">
        для Короля
      </p>
      <p className="pointer-events-none absolute bottom-20 left-2 z-20 block max-w-[122px] -rotate-3 rounded-xl border border-white/40 bg-gradient-to-br from-orange-600/95 to-red-700/95 px-2 py-1.5 text-center font-serif text-[10px] font-bold italic leading-tight text-white shadow-[0_10px_26px_rgba(126,45,12,0.38)] sm:bottom-24 sm:left-4 sm:max-w-[155px] sm:px-3 sm:py-2 sm:text-xs lg:max-w-[190px] lg:text-sm xl:bottom-16 xl:left-[3.5%] xl:max-w-[230px] xl:rounded-2xl xl:px-4 xl:py-2.5 xl:text-lg">
        Мы строим — Вы отдыхаете!
      </p>
      <p className="pointer-events-none absolute bottom-20 right-2 z-20 block max-w-[122px] rotate-3 rounded-xl border border-white/40 bg-gradient-to-bl from-orange-600/95 to-red-700/95 px-2 py-1.5 text-center font-serif text-[10px] font-bold italic leading-tight text-white shadow-[0_10px_26px_rgba(126,45,12,0.38)] sm:bottom-24 sm:right-4 sm:max-w-[155px] sm:px-3 sm:py-2 sm:text-xs lg:max-w-[190px] lg:text-sm xl:bottom-16 xl:right-[3.5%] xl:max-w-[230px] xl:rounded-2xl xl:px-4 xl:py-2.5 xl:text-lg">
        Качество в каждой детали!
      </p>

      <div className="relative z-30 mx-auto flex min-h-[calc(100svh-4rem)] w-full items-start justify-center px-3 pb-8 pt-32 min-[480px]:px-6 min-[480px]:pt-36 sm:min-h-[calc(100svh-5rem)] sm:px-8 sm:pt-40 md:pt-40 lg:min-h-[600px] lg:pt-40 xl:min-h-[620px] xl:pt-44">
        <div className="relative flex min-h-[250px] w-full min-w-0 max-w-[350px] items-center justify-center text-slate-900 min-[480px]:min-h-[270px] min-[480px]:max-w-[410px] sm:min-h-[285px] sm:max-w-[470px] md:max-w-[500px] lg:min-h-[300px] lg:max-w-[540px] xl:min-h-[320px] xl:max-w-[620px]">
          <div className="absolute inset-x-[5.75%] inset-y-[9%] overflow-hidden rounded-[18px] bg-[#fffdf9] shadow-[0_22px_50px_-20px_rgba(71,40,14,0.55)] sm:rounded-[22px]" />
          <img
            src={adminLoginFrame}
            alt=""
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill"
          />

          <div className="relative z-20 w-full px-[12%] py-7 min-[480px]:py-8 sm:px-[12%] sm:py-9 lg:py-10 xl:py-12">
            <h1 className="text-center text-[19px] font-black leading-tight tracking-tight min-[480px]:text-[22px] sm:text-[25px] lg:text-[28px] xl:text-[30px]">Вход владельца сайта</h1>
            <p className="mt-1.5 text-center text-[12px] text-slate-600 sm:mt-2 sm:text-[14px] xl:mt-2.5 xl:text-[15px]">Доступ только для владельца 👑</p>

            {!configured ? <p className="mt-4 text-center text-sm text-destructive xl:mt-5">Административный доступ не настроен.</p> : <form onSubmit={async (event) => { event.preventDefault(); setError(''); try { const ok = await startAdminSession(pin); if (ok) setAllowed(true); else setError('Неверный PIN.'); } catch { setError('Не удалось выполнить вход. Попробуйте ещё раз.'); } }} className="mt-4 space-y-2 min-[480px]:space-y-2.5 sm:mt-5 sm:space-y-3 xl:mt-6 xl:space-y-3.5">
              <div className="relative">
                <input value={pin} onChange={(event) => setPin(event.target.value)} type="password" inputMode="text" autoCapitalize="none" autoCorrect="off" className="h-10 w-full rounded-xl border border-amber-300/70 bg-white px-4 pr-12 outline-none shadow-inner shadow-amber-900/5 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-11 xl:h-12" placeholder="PIN"/>
                <Crown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500/80" strokeWidth={1.8} />
              </div>
              <button className="group relative h-10 w-full overflow-hidden rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-orange-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/35 sm:h-11 sm:text-base xl:h-12">
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

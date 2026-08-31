import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calculator, ChevronUp, ClipboardList, FileText, FolderKanban, Info, Menu, MessageSquareText, Moon, Phone, Sparkles, Sun, Wrench, X } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { TelegramIcon, WhatsAppIcon, MaxIcon, VKIcon } from "./SocialLinks";

const navItems = [
  { path: "/services", label: "Услуги" },
  { path: "/calculator", label: "Калькулятор" },
  { path: "/orders", label: "Активные заказы" },
  { path: "/projects", label: "Проекты" },
  { path: "/reviews", label: "Отзывы" },
];

const mobileNavItems = [
  { path: "/services", label: "Услуги", description: "Все виды работ", icon: Wrench },
  { path: "/calculator", label: "Калькулятор", description: "Рассчитать смету", icon: Calculator },
  { path: "/orders", label: "Заказы", description: "Активные объекты", icon: ClipboardList },
  { path: "/projects", label: "Проекты", description: "Выполненные работы", icon: FolderKanban },
  { path: "/reviews", label: "Отзывы", description: "Мнения клиентов", icon: MessageSquareText },
  { path: "/documentation", label: "Документы", description: "Сметы и проекты", icon: FileText },
  { path: "/about", label: "О компании", description: "Решаем Быстро", icon: Info },
];

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [desktopSosOpen, setDesktopSosOpen] = useState(false);
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => closeMenu(), [location.pathname]);
  useEffect(() => {
    if (menuOpen) {
      setMenuRendered(true);
      return undefined;
    }

    const closeTimer = window.setTimeout(() => setMenuRendered(false), 200);
    return () => window.clearTimeout(closeTimer);
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = (event) => event.matches && setMenuOpen(false);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82), rgba(0,0,0,0.68), rgba(0,0,0,0.82))", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }} className={`fixed inset-x-0 top-0 ${menuOpen ? 'z-[85]' : 'z-50'}`}>
      <div className="page-shell">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
          <Link to="/" aria-label="Решаем Быстро — на главную" className="group relative z-[70] -m-1 flex shrink-0 touch-manipulation select-none items-center gap-2 p-1 sm:gap-3">
            <div className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-xl logo-gradient shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl"><span className="text-xl font-black text-white sm:text-2xl">РБ</span></div>
            <div className="pointer-events-none hidden sm:block"><div className="text-lg font-black text-white">РЕШАЕМ <span style={{ background: "linear-gradient(135deg, #FF6B35, #FF3300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>БЫСТРО</span></div><div className="text-sm text-white/70">Строительные услуги · Саратов</div></div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 min-[900px]:flex xl:gap-1">
            {navItems.map((item) => <Link key={item.path} to={item.path} className={`rounded-xl px-1.5 py-2 text-[11px] font-semibold transition-all duration-200 xl:px-4 xl:text-sm ${isActive(item.path) ? "bg-primary/20 text-primary" : "text-white/80 hover:bg-white/10 hover:text-white"}`}>{item.label}</Link>)}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1.5 xl:flex">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="transition-transform hover:scale-110"><WhatsAppIcon size={32} /></a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" title="Telegram" className="transition-transform hover:scale-110"><TelegramIcon size={32} /></a>
              <a href={MAX_URL} target="_blank" rel="noopener noreferrer" title="MAX" className="transition-transform hover:scale-110"><MaxIcon size={32} /></a>
              <a href={VK_MSG} target="_blank" rel="noopener noreferrer" title="ВКонтакте" className="transition-transform hover:scale-110"><VKIcon size={32} /></a>
            </div>
            <button onClick={onToggleTheme} aria-label="Сменить тему" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white">{theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>

            <button
              type="button"
              onClick={() => setDesktopSosOpen((open) => !open)}
              aria-label={desktopSosOpen ? `Телефон ${PHONE_DISPLAY}` : "Показать номер SOS 24/7"}
              className="sos-pulse hidden h-10 items-center justify-center gap-1.5 rounded-xl logo-gradient px-3 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:opacity-90 active:scale-95 sm:h-auto sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm min-[900px]:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span>{desktopSosOpen ? PHONE_DISPLAY : "SOS 24/7"}</span>
            </button>

            <a href={`tel:${PHONE}`} className="sos-pulse inline-flex h-10 items-center justify-center gap-1.5 rounded-xl logo-gradient px-3 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:opacity-90 active:scale-95 sm:h-auto sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm min-[900px]:hidden"><Phone className="h-4 w-4" /><span>SOS 24/7</span></a>

            <button type="button" aria-label={menuOpen ? "Свернуть меню" : "Открыть меню"} aria-expanded={menuOpen} aria-controls="mobile-site-menu" onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white transition-colors duration-200 hover:bg-white/10 min-[900px]:hidden"><span className={`flex transition-transform duration-200 ease-out ${menuOpen ? "rotate-0" : "rotate-180"}`}>{menuOpen ? <ChevronUp className="h-6 w-6" /> : <Menu className="h-5 w-5" />}</span></button>
          </div>
        </div>
      </div>

      {menuRendered && <div id="mobile-site-menu" className={`absolute inset-x-0 top-full z-[60] h-[calc(100dvh-4rem)] overflow-y-auto bg-black/60 p-3 backdrop-blur-md transition-opacity duration-250 sm:h-[calc(100dvh-5rem)] sm:p-4 min-[900px]:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMenu}>
        <section className={`mx-auto w-full max-w-xl origin-top overflow-hidden rounded-[28px] border border-white/10 bg-[#242321] text-white shadow-[0_24px_70px_-20px_rgba(0,0,0,.9)] transition-all duration-250 ease-out ${menuOpen ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-[.98] opacity-0"}`} onClick={(event) => event.stopPropagation()}>
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-orange-500/25 via-[#302925] to-red-500/15 p-4 sm:p-5">
            <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25"><Sparkles className="h-5 w-5" /></span>
              <div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-orange-300">Решаем Быстро</p><h2 className="truncate text-lg font-black sm:text-xl">Меню сайта</h2></div>
              <button type="button" onClick={closeMenu} aria-label="Закрыть меню" className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.06] text-white/70 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
          </div>

          <nav aria-label="Основная навигация" className="grid grid-cols-2 gap-2.5 p-4 sm:p-5">
            {mobileNavItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return <Link key={item.path} to={item.path} onClick={closeMenu} className={`group flex min-h-[78px] items-center gap-2.5 rounded-2xl border p-3 transition-all duration-200 active:scale-[.98] ${active ? "border-orange-400/60 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/15" : "border-white/10 bg-white/[.055] text-white hover:-translate-y-0.5 hover:border-orange-400/45 hover:bg-orange-500/10"} ${index === mobileNavItems.length - 1 ? 'col-span-2' : ''}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${active ? 'bg-white/20 text-white' : 'bg-white/[.07] text-white/65 group-hover:bg-orange-500 group-hover:text-white'}`}><Icon className="h-5 w-5" /></span>
                <span className="min-w-0"><span className="block truncate text-sm font-black">{item.label}</span><span className={`mt-0.5 block truncate text-[9px] ${active ? 'text-white/75' : 'text-white/40'}`}>{item.description}</span></span>
              </Link>;
            })}
          </nav>

          <div className="border-t border-white/10 p-4 sm:p-5">
            <a href={`tel:${PHONE}`} className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-orange-400/35 bg-gradient-to-r from-orange-500/20 via-red-500/10 to-orange-500/20 p-3.5 shadow-[0_10px_30px_-18px_rgba(255,80,0,.8)] transition hover:border-orange-400/65 hover:bg-orange-500/25 active:scale-[.98]">
              <span className="sos-pulse grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"><Phone className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-black text-white">Авария даже в 3 часа ночи?</span><span className="mt-1 block text-[10px] leading-relaxed text-white/55">Прорвало кран или потекла труба — звоните, срочно выедем на помощь 24/7.</span></span>
              <span className="shrink-0 rounded-lg bg-orange-500 px-2.5 py-2 text-[10px] font-black text-white shadow-md shadow-orange-500/20">SOS</span>
            </a>
          </div>
        </section>
      </div>}
    </header>
  );
}

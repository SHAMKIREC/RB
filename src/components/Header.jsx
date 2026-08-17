import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp, Menu, Moon, Phone, Sun } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { TelegramIcon, WhatsAppIcon, MaxIcon, VKIcon } from "./SocialLinks";

const navItems = [
  { path: "/services", label: "Услуги" },
  { path: "/calculator", label: "Калькулятор" },
  { path: "/orders", label: "Активные заказы" },
  { path: "/projects", label: "Проекты" },
  { path: "/reviews", label: "Отзывы" },
];

const mobileNavItems = [
  ...navItems,
  { path: "/documentation", label: "Документация" },
  { path: "/about", label: "О нас" },
];

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
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

  return (
    <header style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82), rgba(0,0,0,0.68), rgba(0,0,0,0.82))", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }} className="fixed inset-x-0 top-0 z-50">
      <div className="page-shell">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
          <Link to="/" aria-label="Решаем Быстро — на главную" className="group relative z-[70] -m-1 flex shrink-0 touch-manipulation select-none items-center gap-2 p-1 sm:gap-3">
            <div className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-xl logo-gradient shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl"><span className="text-xl font-black text-white sm:text-2xl">РБ</span></div>
            <div className="pointer-events-none hidden sm:block"><div className="text-lg font-black text-white">РЕШАЕМ <span style={{ background: "linear-gradient(135deg, #FF6B35, #FF3300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>БЫСТРО</span></div><div className="text-sm text-white/70">Строительные услуги · Саратов</div></div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navItems.map((item) => <Link key={item.path} to={item.path} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive(item.path) ? "bg-primary/20 text-primary" : "text-white/80 hover:bg-white/10 hover:text-white"}`}>{item.label}</Link>)}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1.5 xl:flex">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="transition-transform hover:scale-110"><WhatsAppIcon size={32} /></a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" title="Telegram" className="transition-transform hover:scale-110"><TelegramIcon size={32} /></a>
              <a href={MAX_URL} target="_blank" rel="noopener noreferrer" title="MAX" className="transition-transform hover:scale-110"><MaxIcon size={32} /></a>
              <a href={VK_MSG} target="_blank" rel="noopener noreferrer" title="ВКонтакте" className="transition-transform hover:scale-110"><VKIcon size={32} /></a>
            </div>
            <button onClick={onToggleTheme} aria-label="Сменить тему" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white">{theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
            <a href={`tel:${PHONE}`} className="sos-pulse inline-flex h-10 items-center justify-center gap-1.5 rounded-xl logo-gradient px-3 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:opacity-90 active:scale-95 sm:h-auto sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"><Phone className="h-4 w-4" /><span>SOS 24/7</span></a>
            <button type="button" aria-label={menuOpen ? "Свернуть меню" : "Открыть меню"} aria-expanded={menuOpen} aria-controls="mobile-site-menu" onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white transition-colors duration-200 hover:bg-white/10 xl:hidden"><span className={`flex transition-transform duration-200 ease-out ${menuOpen ? "rotate-0" : "rotate-180"}`}>{menuOpen ? <ChevronUp className="h-6 w-6" /> : <Menu className="h-5 w-5" />}</span></button>
          </div>
        </div>
      </div>

      {menuRendered && <div id="mobile-site-menu" className={`absolute inset-x-0 top-full z-[60] max-h-[calc(100dvh-4rem)] overflow-y-auto bg-black/55 backdrop-blur-sm transition-opacity duration-200 sm:max-h-[calc(100dvh-5rem)] xl:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMenu}>
        <div className={`bg-background px-5 py-3 shadow-2xl transition-all duration-200 ease-out dark:bg-card ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`} onClick={(event) => event.stopPropagation()}>
          <nav aria-label="Основная навигация" className="space-y-1">
            {mobileNavItems.map((item) => <Link key={item.path} to={item.path} onClick={closeMenu} className={`flex min-h-10 items-center rounded-xl px-4 text-base font-bold transition-all duration-200 ${isActive(item.path) ? "bg-primary/15 text-primary" : "text-foreground hover:translate-x-1 hover:bg-primary/10 hover:text-primary active:translate-x-1 active:bg-primary active:text-white"}`}>{item.label}</Link>)}
          </nav>
        </div>
      </div>}
    </header>
  );
}

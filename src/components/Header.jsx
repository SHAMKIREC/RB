import { Link, useLocation } from "react-router-dom";
import { Phone, Sun, Moon } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { TelegramIcon, WhatsAppIcon, MaxIcon, VKIcon } from "./SocialLinks";

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation();

  const navItems = [
    { path: "/services", label: "Услуги" },
    { path: "/calculator", label: "Калькулятор" },
    { path: "/reviews", label: "Отзывы" },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82), rgba(0,0,0,0.68), rgba(0,0,0,0.82))", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }} className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-14 h-14 rounded-2xl logo-gradient flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
              <span className="text-white font-black text-2xl">РБ</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-lg text-white">
                РЕШАЕМ{" "}
                <span style={{ background: "linear-gradient(135deg, #FF6B35, #FF3300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>БЫСТРО</span>
              </div>
              <div className="text-sm text-white/70">Строительные услуги · Саратов</div>
            </div>
          </Link>

          {/* Nav center */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-primary bg-primary/20"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Social icons desktop */}
            <div className="hidden lg:flex items-center gap-1.5">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="hover:scale-110 transition-transform">
                <WhatsAppIcon size={32} />
              </a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" title="Telegram" className="hover:scale-110 transition-transform">
                <TelegramIcon size={32} />
              </a>
              <a href={MAX_URL} target="_blank" rel="noopener noreferrer" title="MAX" className="hover:scale-110 transition-transform">
                <MaxIcon size={32} />
              </a>
              <a href={VK_MSG} target="_blank" rel="noopener noreferrer" title="ВКонтакте" className="hover:scale-110 transition-transform">
                <VKIcon size={32} />
              </a>
            </div>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              title="Сменить тему"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* SOS button */}
            <div className="flex flex-col items-center">
              <a
                href={`tel:${PHONE}`}
                className="sos-pulse flex items-center gap-2 px-4 py-2.5 sm:px-5 logo-gradient text-white rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-orange-500/25"
              >
                <Phone className="w-4 h-4" />
                <span>SOS 24/7</span>
              </a>
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5 whitespace-nowrap">Срочный вызов мастера</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
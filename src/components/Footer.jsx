import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { WhatsAppIcon, TelegramIcon, MaxIcon, VKIcon } from "./SocialLinks";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82), rgba(0,0,0,0.68), rgba(0,0,0,0.82))", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }} className="hidden md:block text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
        <div className="grid grid-cols-3 gap-12 items-start">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl logo-gradient flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
                <span className="text-white font-black text-2xl">РБ</span>
              </div>
              <div>
                <div className="font-black text-lg text-white">
                  РЕШАЕМ{" "}
                  <span style={{ background: "linear-gradient(135deg, #FF6B35, #FF3300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>БЫСТРО</span>
                </div>
                <div className="text-sm text-white/70">Строительные услуги · Саратов</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span>г. Саратов, работаем 24/7</span>
            </div>
            <p className="text-xs text-white/60 mb-5">Цены без учёта материалов · Мин. заказ 5 000 ₽</p>

            <p className="text-xs text-white/60 mb-3 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Мы в соцсетях
            </p>
            <div className="flex gap-2.5">
              {[
                { href: TELEGRAM, icon: <TelegramIcon size={36} />, title: "Telegram" },
                { href: WHATSAPP, icon: <WhatsAppIcon size={36} />, title: "WhatsApp" },
                { href: MAX_URL, icon: <MaxIcon size={36} />, title: "MAX" },
                { href: VK_MSG, icon: <VKIcon size={36} />, title: "ВКонтакте" },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} className="hover:scale-110 transition-transform">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Nav */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-base uppercase tracking-wider">Навигация</h3>
            <div className="flex flex-col gap-3">
              {[
                { to: "/services", label: "Все услуги" },
                { to: "/calculator", label: "Калькулятор-смета" },
                { to: "/reviews", label: "Отзывы клиентов" },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="text-white/70 hover:text-white transition-colors text-sm">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Contacts */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-base uppercase tracking-wider">Контакты</h3>
            <div className="flex flex-col gap-2">
              <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <div className="font-bold font-mono text-xs text-white">{PHONE_DISPLAY}</div>
                  <div className="text-[10px] text-white/60">Звонок · Ежедневно 24/7</div>
                </div>
              </a>

              {[
                { href: WHATSAPP, icon: <WhatsAppIcon size={24} />, label: "WhatsApp", sub: "Написать сейчас" },
                { href: TELEGRAM, icon: <TelegramIcon size={24} />, label: "Telegram", sub: "Написать сейчас" },
                { href: MAX_URL, icon: <MaxIcon size={24} />, label: "MAX (менеджер)", sub: "Написать в MAX" },
                { href: VK_MSG, icon: <VKIcon size={24} />, label: "ВКонтакте", sub: "Написать в ВК" },
              ].map((c) => (
                <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="flex-shrink-0">{c.icon}</div>
                  <div>
                    <div className="font-bold text-xs text-white">{c.label}</div>
                    <div className="text-[10px] text-white/60">{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Решаем Быстро · Строительство и ремонт в Саратове
        </div>
      </div>
    </footer>
  );
}
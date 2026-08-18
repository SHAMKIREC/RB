import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { MAX_URL, PHONE, PHONE_DISPLAY, TELEGRAM, VK_MSG, WHATSAPP } from "../lib/calcData";
import { MaxIcon, TelegramIcon, VKIcon, WhatsAppIcon } from "./SocialLinks";
import { FOOTER_NAVIGATION } from "../data/navigation";
import AppInstallSection from "./AppInstallSection";

const COMPANY_INFO = {
  location: "г. Саратов, работаем 24/7",
  pricing: "Цены без учёта материалов · Мин. заказ 5 000 ₽",
  copyright: "© 2026 Решаем Быстро · Строительство и ремонт в Саратове",
};

const contacts = [
  { label: "Телефон", detail: PHONE_DISPLAY, desktopLabel: PHONE_DISPLAY, desktopDetail: "Звонок · Ежедневно 24/7", href: `tel:${PHONE}`, icon: <Phone className="h-5 w-5" /> },
  { label: "WhatsApp", detail: "Написать", desktopLabel: "WhatsApp", desktopDetail: "Написать сейчас", href: WHATSAPP, icon: <WhatsAppIcon size={22} /> },
  { label: "Telegram", detail: "Написать", desktopLabel: "Telegram", desktopDetail: "Написать сейчас", href: TELEGRAM, icon: <TelegramIcon size={22} /> },
  { label: "ВКонтакте", detail: "Открыть", desktopLabel: "ВКонтакте", desktopDetail: "Написать в VK", href: VK_MSG, icon: <VKIcon size={22} /> },
  { label: "MAX", detail: "Связаться", desktopLabel: "MAX (менеджер)", desktopDetail: "Написать в MAX", href: MAX_URL, icon: <MaxIcon size={22} /> },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl logo-gradient shadow-lg shadow-orange-500/20">
        <span className="text-xl font-black text-white">РБ</span>
      </div>
      <div>
        <p className="text-base font-black text-white">РЕШАЕМ <span className="text-primary">БЫСТРО</span></p>
        <p className="text-xs text-white/65">Строительные услуги · Саратов</p>
      </div>
    </div>
  );
}

function CompanyDetails() {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-sm text-white/80">
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <span>{COMPANY_INFO.location}</span>
      </div>
      <p className="mt-2 text-xs text-white/60">{COMPANY_INFO.pricing}</p>
    </div>
  );
}

function FooterLinks({ responsive = false }) {
  const classes = responsive
    ? "mt-3 flex flex-col gap-1.5"
    : "mt-3 flex flex-col gap-2.5";

  return (
    <nav className={classes}>
      {FOOTER_NAVIGATION.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={responsive
            ? "block rounded-md py-0.5 text-[15px] leading-snug text-white/75 transition-colors duration-200 hover:pl-1 hover:text-primary motion-reduce:transition-none"
            : "text-sm text-white/70 transition-all duration-200 hover:pl-1 hover:text-primary"}
        >
          {item.label}
        </Link>
      ))}
      <Link to="/privacy" className={responsive ? "block rounded-md py-0.5 text-[15px] leading-snug text-white/75 transition-colors duration-200 hover:text-primary" : "text-sm text-white/70 transition-all duration-200 hover:text-primary"}>Политика обработки персональных данных</Link>
    </nav>
  );
}

function ContactLinks({ responsive = false }) {
  const classes = responsive
    ? "mt-3 flex flex-col gap-2.5"
    : "mt-3 flex flex-col gap-2";

  return (
    <div className={classes}>
      {contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target={contact.href.startsWith("tel:") ? undefined : "_blank"}
          rel={contact.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
          className={responsive
            ? "group flex items-center gap-2.5 text-white/80 transition-all duration-200 hover:pl-1 hover:text-primary"
            : "group flex items-center gap-2.5 text-white/80 transition-all duration-200 hover:pl-1 hover:text-primary"}
        >
          <span className={responsive ? "flex h-7 w-7 shrink-0 items-center justify-center text-primary [&>img]:h-[22px] [&>img]:w-[22px] [&>svg]:h-[22px] [&>svg]:w-[22px]" : "flex h-7 w-7 shrink-0 items-center justify-center text-primary [&>img]:h-[22px] [&>img]:w-[22px] [&>svg]:h-[22px] [&>svg]:w-[22px]"}>{contact.icon}</span>
          <span className={responsive ? "text-sm" : "text-sm"}>
            <span className="block text-sm font-semibold leading-tight text-white">{contact.desktopLabel}</span>
            <span className="mt-0.5 block text-[11px] leading-tight text-white/55">{contact.desktopDetail}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82), rgba(0,0,0,0.68), rgba(0,0,0,0.82))", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      className="text-white"
    >
      <div className="hidden xl:block">
        <div className="page-shell py-9">
          <div className="grid grid-cols-3 items-start gap-12">
            <div><Brand /><CompanyDetails /></div>
            <div><h3 className="text-base font-semibold uppercase tracking-wider">Навигация</h3><FooterLinks /></div>
            <div><h3 className="text-base font-semibold uppercase tracking-wider">Контакты</h3><ContactLinks /></div>
          </div>
          <div className="mx-auto mt-8 max-w-2xl"><AppInstallSection /></div>
          <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/50">{COMPANY_INFO.copyright}</p>
        </div>
      </div>

      <div className="page-shell pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-7 xl:hidden">
        <div><Brand /><CompanyDetails /></div>
        <div className="mt-6"><AppInstallSection /></div>
        <div className="mt-8 grid gap-8 border-t border-white/10 pt-6 min-[600px]:grid-cols-2 min-[600px]:gap-10">
          <section><h2 className="text-lg font-bold uppercase tracking-wider text-white">Навигация</h2><FooterLinks responsive /></section>
          <section><h2 className="text-lg font-bold uppercase tracking-wider text-white">Контакты</h2><ContactLinks responsive /></section>
        </div>
        <p className="mt-8 border-t border-white/10 pt-4 text-center text-xs leading-relaxed text-white/50">{COMPANY_INFO.copyright}</p>
      </div>
    </footer>
  );
}

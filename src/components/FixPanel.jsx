import { Phone } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { WhatsAppIcon, TelegramIcon, MaxIcon, VKIcon } from "./SocialLinks";

const panelItems = [
  { label: "Позвонить", href: `tel:${PHONE}`, Icon: Phone, surface: "bg-gradient-to-br from-[#ff7138] to-[#ff3218]", glow: "shadow-[0_9px_22px_-10px_rgba(255,80,0,.8)]" },
  { label: "WhatsApp", href: WHATSAPP, Icon: WhatsAppIcon, surface: "bg-gradient-to-br from-[#32dc73] to-[#18b957]", glow: "shadow-[0_9px_22px_-10px_rgba(37,211,102,.8)]" },
  { label: "Telegram", href: TELEGRAM, Icon: TelegramIcon, surface: "bg-gradient-to-br from-[#36b5ed] to-[#168dcc]", glow: "shadow-[0_9px_22px_-10px_rgba(34,158,217,.8)]" },
  { label: "MAX", href: MAX_URL, Icon: MaxIcon, surface: "bg-gradient-to-br from-[#5ca7ff] via-[#765af5] to-[#bd35ea]", glow: "shadow-[0_9px_22px_-10px_rgba(126,100,255,.85)]" },
  { label: "ВКонтакте", href: VK_MSG, Icon: VKIcon, surface: "bg-gradient-to-br from-[#248dff] to-[#0069e7]", glow: "shadow-[0_9px_22px_-10px_rgba(0,119,255,.8)]" },
];

export default function FixPanel() {
  return <nav aria-label="Быстрая связь" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] xl:hidden">
    <div className="pointer-events-auto mx-auto grid w-full max-w-xl grid-cols-5 gap-1.5 rounded-[1.65rem] border border-primary/25 bg-card/90 p-2 shadow-[0_-8px_35px_-16px_rgba(15,23,42,.7),0_8px_30px_-16px_rgba(255,80,0,.45)] backdrop-blur-2xl dark:bg-card/92 sm:gap-2 sm:p-2.5">
      {panelItems.map(({ label, href, Icon, surface, glow }) => {
        const iconSize = label === "Позвонить" ? 32 : 38;
        const content = <><span className="transition-transform duration-200 group-hover:scale-110"><Icon size={iconSize} bare /></span><span className="sr-only">{label}</span></>;
        const className = `group relative flex h-14 items-center justify-center overflow-hidden rounded-[1.15rem] border border-white/35 p-0 text-white transition-all duration-200 before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${surface} ${glow}`;
        return href ? <a key={label} href={href} target={href.startsWith("tel:") ? undefined : "_blank"} rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"} aria-label={label} className={className}>{content}</a> : <span key={label} aria-label={`${label}: контакт уточняется`} aria-disabled="true" className={`${className} cursor-not-allowed opacity-45`}>{content}</span>;
      })}
    </div>
  </nav>;
}

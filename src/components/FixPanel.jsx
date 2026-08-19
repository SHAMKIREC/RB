import { Phone } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { WhatsAppIcon, TelegramIcon, MaxIcon, VKIcon } from "./SocialLinks";

const panelItems = [
  { label: "Позвонить", href: `tel:${PHONE}`, Icon: Phone, color: "text-primary", glow: "hover:shadow-[0_10px_25px_-12px_rgba(255,80,0,.9)]" },
  { label: "WhatsApp", href: WHATSAPP, Icon: WhatsAppIcon, color: "text-[#25D366]", glow: "hover:shadow-[0_10px_25px_-12px_rgba(37,211,102,.85)]" },
  { label: "Telegram", href: TELEGRAM, Icon: TelegramIcon, color: "text-[#229ED9]", glow: "hover:shadow-[0_10px_25px_-12px_rgba(34,158,217,.85)]" },
  { label: "MAX", href: MAX_URL, Icon: MaxIcon, color: "text-[#6f8ff0]", glow: "hover:shadow-[0_10px_25px_-12px_rgba(126,100,255,.85)]" },
  { label: "ВКонтакте", href: VK_MSG, Icon: VKIcon, color: "text-[#0077FF]", glow: "hover:shadow-[0_10px_25px_-12px_rgba(0,119,255,.85)]" },
];

export default function FixPanel() {
  return <nav aria-label="Быстрая связь" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] xl:hidden">
    <div className="pointer-events-auto mx-auto grid w-full max-w-xl grid-cols-5 gap-1.5 rounded-[1.65rem] border border-primary/25 bg-card/90 p-2 shadow-[0_-8px_35px_-16px_rgba(15,23,42,.7),0_8px_30px_-16px_rgba(255,80,0,.45)] backdrop-blur-2xl dark:bg-card/92 sm:gap-2 sm:p-2.5">
      {panelItems.map(({ label, href, Icon, color, glow }) => {
        const iconSize = label === "Позвонить" ? 32 : 38;
        const content = <><span className={`transition-transform duration-200 group-hover:scale-110 ${label === "MAX" ? "brightness-110 saturate-150 contrast-110" : ""}`}><Icon size={iconSize} /></span><span className="sr-only">{label}</span></>;
        const className = `group relative flex h-14 items-center justify-center overflow-hidden rounded-[1.15rem] border border-primary/35 bg-gradient-to-b from-white to-orange-50/65 p-0 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_5px_14px_-10px_rgba(234,88,12,.65)] transition-all duration-200 before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/35 before:to-transparent hover:-translate-y-1 hover:border-primary/70 active:translate-y-0 active:scale-95 dark:from-white/10 dark:to-orange-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${color} ${glow}`;
        return href ? <a key={label} href={href} target={href.startsWith("tel:") ? undefined : "_blank"} rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"} aria-label={label} className={className}>{content}</a> : <span key={label} aria-label={`${label}: контакт уточняется`} aria-disabled="true" className={`${className} cursor-not-allowed opacity-45`}>{content}</span>;
      })}
    </div>
  </nav>;
}

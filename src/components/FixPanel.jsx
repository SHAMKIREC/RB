import { Phone } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { WhatsAppIcon, TelegramIcon, MaxIcon, VKIcon } from "./SocialLinks";

const panelItems = [
  { label: "Позвонить", href: `tel:${PHONE}`, Icon: Phone, color: "text-primary" },
  { label: "WhatsApp", href: WHATSAPP, Icon: WhatsAppIcon, color: "text-[#25D366]" },
  { label: "Telegram", href: TELEGRAM, Icon: TelegramIcon, color: "text-[#229ED9]" },
  { label: "MAX", href: MAX_URL, Icon: MaxIcon, color: "text-[#6f8ff0]" },
  { label: "ВКонтакте", href: VK_MSG, Icon: VKIcon, color: "text-[#0077FF]" },
];

export default function FixPanel() {
  return <nav aria-label="Быстрая связь" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-24px_rgba(15,23,42,0.7)] backdrop-blur-xl xl:hidden">
    <div className="mx-auto grid w-full max-w-xl grid-cols-5 gap-2 px-3 py-2.5">
      {panelItems.map(({ label, href, Icon, color }) => {
        const iconSize = label === "Позвонить" ? 38 : 40;
        const content = <><span className={label === "MAX" ? "brightness-125 saturate-150 contrast-125" : ""}><Icon size={iconSize} /></span><span className="sr-only">{label}</span></>;
        const className = `flex h-14 items-center justify-center rounded-xl border border-primary/80 bg-card/80 p-0 shadow-[0_7px_14px_-10px_rgba(234,88,12,0.72)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-[0_11px_18px_-10px_rgba(234,88,12,0.9)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${color}`;
        return href ? <a key={label} href={href} target={href.startsWith("tel:") ? undefined : "_blank"} rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"} aria-label={label} className={className}>{content}</a> : <span key={label} aria-label={`${label}: контакт уточняется`} aria-disabled="true" className={`${className} cursor-not-allowed opacity-45`}>{content}</span>;
      })}
    </div>
  </nav>;
}

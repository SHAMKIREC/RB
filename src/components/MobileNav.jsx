import { Phone } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { MaxIcon, TelegramIcon, VKIcon, WhatsAppIcon } from "./SocialLinks";

const contacts = [
  { label: "Позвонить", href: `tel:${PHONE}`, Icon: Phone },
  { label: "ВКонтакте", href: VK_MSG, Icon: VKIcon },
  { label: "Telegram", href: TELEGRAM, Icon: TelegramIcon },
  { label: "MAX", href: MAX_URL?.startsWith("tel:") ? null : MAX_URL, Icon: MaxIcon },
  { label: "WhatsApp", href: WHATSAPP, Icon: WhatsAppIcon },
];

export default function MobileNav() {
  return <>
    <nav aria-label="Быстрая связь" className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),4px)] lg:hidden">
      <div className="mx-auto grid w-[calc(100%-24px)] max-w-sm grid-cols-5 gap-1.5 rounded-2xl border border-border/70 bg-background/90 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,.16)] backdrop-blur-xl">
        {contacts.map(({ label, href, Icon }) => {
          const content = <><Icon size={21} /><span className="sr-only">{label}</span></>;
          const className = "flex h-10 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-all active:scale-95 hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
          return href ? <a key={label} href={href} target={href.startsWith("tel:") ? undefined : "_blank"} rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"} aria-label={label} className={className}>{content}</a> : <span key={label} aria-label={`${label}: контакт уточняется`} aria-disabled="true" className={`${className} cursor-not-allowed opacity-45`}>{content}</span>;
        })}
      </div>
    </nav>
    <div className="h-14 lg:hidden" aria-hidden="true" />
  </>;
}

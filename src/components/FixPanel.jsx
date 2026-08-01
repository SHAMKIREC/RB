import { Phone } from "lucide-react";
import { PHONE, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../lib/calcData";
import { WhatsAppIcon, TelegramIcon, MaxIcon, VKIcon } from "./SocialLinks";

export default function FixPanel() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/98 backdrop-blur-xl border-t border-border shadow-2xl">
      <div className="grid grid-cols-5 gap-1 p-2">
        <a href={`tel:${PHONE}`} className="flex flex-col items-center justify-center gap-0.5 py-2.5 logo-gradient text-white rounded-xl font-bold text-[9px] active:scale-95 transition-transform">
          <Phone className="w-4 h-4" />
          Звонок
        </a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-[9px] active:scale-95 transition-transform">
          <WhatsAppIcon size={16} />
          WA
        </a>
        <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-[#229ED9] text-white rounded-xl font-bold text-[9px] active:scale-95 transition-transform">
          <TelegramIcon size={16} />
          TG
        </a>
        <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-gradient-to-br from-[#5B9BF5] to-[#9B59F5] text-white rounded-xl font-bold text-[9px] active:scale-95 transition-transform">
          <MaxIcon size={16} />
          MAX
        </a>
        <a href={VK_MSG} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2.5 bg-[#0077FF] text-white rounded-xl font-bold text-[9px] active:scale-95 transition-transform">
          <VKIcon size={16} />
          ВК
        </a>
      </div>
    </div>
  );
}
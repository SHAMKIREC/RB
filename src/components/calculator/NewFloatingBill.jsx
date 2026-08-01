import { Phone, AlertTriangle } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP, TELEGRAM, VK_MSG, MAX_URL } from "../../lib/calcData";
import { WhatsAppIcon, TelegramIcon, MaxIcon, VKIcon } from "../SocialLinks";

const MIN_ORDER = 5000;

export default function NewFloatingBill({ workTotal, matTotal, coeffTotal, breakdown, coeffPercent, withMaterials }) {
  const total = Math.round(coeffTotal);
  const isBelowMin = total > 0 && total < MIN_ORDER;

  return (
    <div className="sticky top-24 border border-border rounded-3xl bg-card shadow-xl shadow-black/10 overflow-hidden">
      {/* Header — total */}
      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white">
        <p className="text-xs font-mono font-bold uppercase tracking-widest opacity-60 mb-1">СМЕТА</p>
        <div className="text-4xl font-mono font-black">
          {total.toLocaleString("ru-RU")} <span className="text-orange-400">₽</span>
        </div>
        {/* breakdown by type */}
        {(workTotal > 0 || matTotal > 0) && (
          <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
            {workTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Работы</span>
                <span className="font-mono font-bold">{Math.round(workTotal).toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            {matTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Материалы</span>
                <span className="font-mono font-bold text-blue-300">{Math.round(matTotal).toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            {coeffPercent > 0 && (
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Коэф. +{Math.round(coeffPercent * 100)}%</span>
                <span className="font-mono font-bold text-yellow-300">{Math.round(coeffTotal - workTotal - matTotal).toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
          </div>
        )}
        <div className="mt-3 text-xs opacity-50">
          {withMaterials ? "✅ Смета включает работы и материалы" : "⚠️ Без учёта материалов"}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Item breakdown */}
        {breakdown.length > 0 ? (
          <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-2">
                <span className="text-muted-foreground text-xs leading-snug">{item.name}</span>
                <span className="font-mono font-bold text-foreground whitespace-nowrap text-xs">{item.total.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 text-muted-foreground">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm font-medium">Выберите работы</div>
            <div className="text-xs">для составления сметы</div>
          </div>
        )}

        {isBelowMin && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs font-bold text-primary">Мин. заказ — 5 000 ₽</span>
          </div>
        )}

        {/* CTA buttons */}
        <div className="space-y-2">
          <a
            href={`tel:${PHONE}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-black text-sm shadow-lg shadow-orange-500/25 hover:brightness-105 active:scale-95 transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Позвонить {PHONE_DISPLAY}</span>
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
              <WhatsAppIcon size={20} />
              WhatsApp
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#229ED9] text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
              <TelegramIcon size={20} />
              Telegram
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-[#5B9BF5] to-[#9B59F5] text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
              <MaxIcon size={20} />
              MAX
            </a>
            <a href={VK_MSG} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#0077FF] text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
              <VKIcon size={20} />
              ВКонтакте
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
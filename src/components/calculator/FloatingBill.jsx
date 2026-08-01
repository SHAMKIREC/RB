import { Phone, AlertTriangle } from "lucide-react";
import { PHONE_NUMBER, VK_URL, MIN_ORDER } from "../../lib/servicesData";

export default function FloatingBill({ total, breakdown }) {
  const isBelowMinimum = total > 0 && total < MIN_ORDER;

  return (
    <div className="sticky top-24 border border-border rounded-3xl bg-card shadow-xl shadow-black/5 p-5 sm:p-6">
      <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-5">
        Ваш расчёт
      </h3>

      {/* Breakdown */}
      {breakdown.length > 0 ? (
        <div className="space-y-2 mb-5 max-h-60 overflow-y-auto no-scrollbar">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2 text-sm">
              <span className="text-muted-foreground leading-snug">{item.name}</span>
              <span className="font-mono font-bold text-foreground whitespace-nowrap">
                {item.total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground mb-5">
          Выберите работы<br />для расчёта стоимости
        </div>
      )}

      <div className="border-t border-border my-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-base font-bold text-foreground">ИТОГО</span>
        <span className="text-3xl font-mono font-black gradient-text">
          {total.toLocaleString("ru-RU")} ₽
        </span>
      </div>

      {/* Minimum warning */}
      {isBelowMinimum && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-2xl mb-4">
          <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm font-bold text-primary">
            Минимальный заказ — {MIN_ORDER.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-2.5">
        <a
          href={PHONE_NUMBER}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4" />
          Позвонить
        </a>
        <a
          href={VK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0077FF] text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M21.579 6.855c.14-.465 0-.806-.662-.806h-2.193c-.558 0-.813.295-.953.619 0 0-1.114 2.713-2.693 4.476-.511.513-.743.676-1.022.676-.139 0-.341-.163-.341-.628V6.855c0-.558-.161-.806-.626-.806H9.642c-.348 0-.558.258-.558.504 0 .528.79.65.871 2.138v3.228c0 .707-.128.836-.407.836-.743 0-2.551-2.725-3.621-5.843-.21-.605-.421-.85-.982-.85H2.752c-.627 0-.752.295-.752.619 0 .58.743 3.452 3.461 7.254 1.812 2.601 4.363 4.011 6.687 4.011 1.393 0 1.565-.313 1.565-.852v-1.966c0-.626.133-.752.574-.752.325 0 .883.163 2.184 1.417 1.486 1.486 1.732 2.153 2.567 2.153h2.192c.626 0 .939-.313.759-.931-.197-.615-.907-1.51-1.849-2.569-.512-.604-1.277-1.254-1.51-1.579-.325-.419-.232-.604 0-.976.001 0 2.672-3.759 2.949-5.036z"/>
          </svg>
          Написать в ВК
        </a>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Без учёта материалов · Мин. заказ 5 000 ₽
      </p>
    </div>
  );
}
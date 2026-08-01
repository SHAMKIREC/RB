import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PriceCategory({ category, quantities, onQuantityChange }) {
  const [open, setOpen] = useState(false);

  const categoryTotal = category.items.reduce((sum, item, idx) => {
    const qty = quantities[idx] || 0;
    return sum + item.price * qty;
  }, 0);

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-foreground">{category.name}</h3>
          {categoryTotal > 0 && (
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-lg">
              {categoryTotal.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-border">
          {category.items.map((item, idx) => {
            const qty = quantities[idx] || 0;
            const lineTotal = item.price * qty;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-border/50 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {item.price.toLocaleString("ru-RU")} ₽ / {item.unit}
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  value={qty || ""}
                  onChange={(e) => onQuantityChange(idx, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 sm:w-24 px-3 py-2 bg-secondary border border-border rounded-lg font-mono text-sm text-foreground text-center placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {lineTotal > 0 && (
                  <div className="w-24 text-right text-sm font-mono font-bold text-primary">
                    {lineTotal.toLocaleString("ru-RU")} ₽
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
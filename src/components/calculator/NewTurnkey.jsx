import { useState } from "react";
import { TURNKEY_NEW } from "../../lib/calcData";

export default function NewTurnkey({ onTotalChange }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");

  const handleSelect = (id) => {
    const next = selected === id ? null : id;
    setSelected(next);
    if (next && qty) {
      const opt = TURNKEY_NEW.find(o => o.id === next);
      onTotalChange(opt.unit === "шт" ? opt.price : opt.price * parseFloat(qty), next);
    } else {
      onTotalChange(0, null);
    }
  };

  const handleQty = (val) => {
    setQty(val);
    if (selected && val) {
      const opt = TURNKEY_NEW.find(o => o.id === selected);
      onTotalChange(opt.unit === "шт" ? opt.price : opt.price * parseFloat(val), selected);
    } else {
      onTotalChange(0, null);
    }
  };

  const selOpt = TURNKEY_NEW.find(o => o.id === selected);

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🏠</span>
          <h3 className="text-base font-bold text-foreground">Ремонт под ключ</h3>
        </div>
        <p className="text-xs text-muted-foreground">Комплексный ремонт помещения</p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {TURNKEY_NEW.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                selected === option.id
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-secondary/30"
              }`}
            >
              <div className="text-xs font-bold text-foreground mb-1">{option.name}</div>
              <div className="text-lg font-mono font-black text-primary">{option.price.toLocaleString("ru-RU")} ₽</div>
              <div className="text-[10px] text-muted-foreground">за {option.unit}</div>
            </button>
          ))}
        </div>

        {selected && selOpt && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{selOpt.desc}</span>
            </div>
            {selOpt.unit !== "шт" && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Площадь (м²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={qty}
                  onChange={(e) => handleQty(e.target.value)}
                  placeholder="0"
                  className="w-40 px-4 py-2.5 bg-secondary border border-border rounded-xl font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            {(selOpt.unit === "шт" || (qty && parseFloat(qty) > 0)) && (
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                <span className="text-sm font-bold text-primary">
                  Итого: {(selOpt.unit === "шт" ? selOpt.price : selOpt.price * parseFloat(qty || 0)).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
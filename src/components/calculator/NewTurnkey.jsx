import { useEffect, useMemo, useState } from "react";
import { TURNKEY_NEW } from "../../lib/calcData";
import { getTurnkeyPrice, setPriceOverride } from "../../lib/pricingStorage";
import { useInlineEditMode, usePricingOverrides } from "../../hooks/usePricingState";
import InlinePriceEditor from "../admin/InlinePriceEditor";
import { House } from "lucide-react";

const integerQuantity = (value) => Math.max(0, Math.round(Number(value) || 0));

export default function NewTurnkey({ onTotalChange, resetSignal = 0 }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const pricingOverrides = usePricingOverrides();
  const inlineEditMode = useInlineEditMode();
  const options = useMemo(() => TURNKEY_NEW.map((option) => ({ ...option, price: getTurnkeyPrice(option, pricingOverrides) })), [pricingOverrides]);
  const selOpt = options.find((option) => option.id === selected);

  useEffect(() => {
    if (resetSignal === 0) return;
    setSelected(null);
    setQty("");
  }, [resetSignal]);

  useEffect(() => {
    if (!selOpt) { onTotalChange(0, null); return; }
    const quantity = integerQuantity(qty);
    onTotalChange(selOpt.unit === "шт" ? selOpt.price : quantity ? selOpt.price * quantity : 0, selected);
  }, [onTotalChange, qty, selected, selOpt]);

  const handleSelect = (id) => {
    const next = selected === id ? null : id;
    setSelected(next);
  };

  const handleQty = (val) => {
    const nextQuantity = integerQuantity(val);
    setQty(val === "" ? "" : String(nextQuantity));
  };

  return (
    <div className="turnkey-calculator-card rb-card overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="turnkey-calculator-header px-4 py-3 border-b border-border bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><House className="h-4 w-4" /></span>
          <h3 className="text-sm font-bold text-foreground">Ремонт под ключ</h3>
        </div>
        <p className="text-xs text-muted-foreground">Комплексный ремонт помещения</p>
      </div>

      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {options.map((option) => (
            <div key={option.id} className="min-w-0">
            <button
              type="button"
              onClick={() => handleSelect(option.id)}
              className={`w-full p-2.5 rounded-xl border-2 text-left transition-all ${
                selected === option.id
                  ? "calc-active-surface border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "calc-base-surface border-primary/60 bg-white hover:border-primary hover:bg-secondary/30 dark:bg-card"
              }`}
            >
              <div className="text-xs font-bold text-foreground mb-1">{option.name}</div>
              <div className="text-base font-mono font-black text-primary">{option.price.toLocaleString("ru-RU")} ₽</div>
              <div className="text-[10px] text-muted-foreground">за {option.unit}</div>
            </button>
              {inlineEditMode && <InlinePriceEditor value={option.price} onSave={(value) => setPriceOverride('turnkey', option.id, value)} />}
            </div>
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
                  step="1"
                  value={qty}
                  onChange={(e) => handleQty(e.target.value)}
                  placeholder="0"
                  className="w-40 px-4 py-2.5 bg-secondary border border-border rounded-xl font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            {(selOpt.unit === "шт" || (qty && integerQuantity(qty) > 0)) && (
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                <span className="text-sm font-bold text-primary">
                  Итого: {(selOpt.unit === "шт" ? selOpt.price : selOpt.price * integerQuantity(qty)).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

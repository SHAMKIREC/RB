import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { getMaterialsForWork } from "../../lib/materialsData";
import { setPriceOverride } from "../../lib/pricingStorage";
import { useInlineEditMode } from "../../hooks/usePricingState";
import InlinePriceEditor from "../admin/InlinePriceEditor";

function CalcItem({ item, mode, qty, withMaterials, onChange, onMaterialRequest }) {
  const price = mode === "dismount" ? item.dismount : item.mount;
  const workTotal = price * (qty || 0);

  let matTotal = 0;
  if (withMaterials && qty) {
    matTotal = item.materials.reduce((s, m) => s + m.consumption * qty * m.price * 1.2, 0);
  }
  const lineTotal = workTotal + matTotal;
  const isActive = qty > 0;
  const inlineEditMode = useInlineEditMode();
  const estimateScrollTimer = useRef(null);

  const changeWithEstimateScroll = (nextValue) => {
    onChange(nextValue);
    if (typeof window === "undefined" || !window.matchMedia("(max-width: 1023px)").matches) return;
    window.clearTimeout(estimateScrollTimer.current);
    estimateScrollTimer.current = window.setTimeout(() => {
      document.getElementById("calculator-estimate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
  };

  return (
    <div className={`calc-work-row ${isActive ? "calc-work-row-active bg-[linear-gradient(90deg,rgba(255,247,234,.95),rgba(255,253,250,.7))] shadow-[inset_3px_0_0_hsl(var(--primary))]" : "bg-[#fffaf3] hover:bg-orange-50/75"} border-b border-slate-200/80 px-3 py-3 last:border-b-0 transition-colors`}>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground"}`}>
            {item.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">
              {price > 0 ? `${price.toLocaleString("ru-RU")} ₽ / ${item.unit}` : "—"}
            </span>
            {inlineEditMode && mode === "mount" && <InlinePriceEditor value={price} onSave={(value) => setPriceOverride('calculatorWorks', item.id, value)} />}
            {withMaterials && item.materials.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-medium">+ материалы</span>
            )}
          </div>
        </div>

        {price > 0 ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="calc-quantity-control calc-base-surface flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
              <button
                onClick={() => changeWithEstimateScroll(Math.max(0, (qty || 0) - 1))}
                aria-label={`Уменьшить количество: ${item.name}`}
                className="h-10 w-10 sm:h-7 sm:w-7 flex items-center justify-center text-muted-foreground hover:bg-orange-50 hover:text-primary transition-colors text-base font-bold dark:hover:bg-primary/15"
              >−</button>
              <input
                type="number"
                min="0"
                step="1"
                value={qty || ""}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== "") onChange(Math.max(0, Math.round(Number(e.target.value) || 0)));
                }}
                placeholder="0"
                className="calc-base-surface h-10 w-12 sm:h-7 bg-[#fffdfa] font-mono text-xs font-bold text-foreground text-center focus:outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => changeWithEstimateScroll((qty || 0) + 1)}
                aria-label={`Увеличить количество: ${item.name}`}
                className="h-10 w-10 sm:h-7 sm:w-7 flex items-center justify-center text-muted-foreground hover:bg-orange-50 hover:text-primary transition-colors text-base font-bold dark:hover:bg-primary/15"
              >+</button>
            </div>
            {lineTotal > 0 && (
              <div className="w-28 text-right">
                <div className="text-sm font-mono font-bold text-primary">{lineTotal.toLocaleString("ru-RU")} ₽</div>
                {withMaterials && matTotal > 0 && (
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">мат: {Math.round(matTotal).toLocaleString("ru-RU")} ₽</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground px-3">только монтаж</span>
        )}
      </div>

      {isActive && onMaterialRequest && getMaterialsForWork(item.id).length > 0 && <button onClick={() => onMaterialRequest(item)} className="mt-1.5 text-[11px] font-bold text-primary border border-primary/30 rounded-lg px-2.5 py-1 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Подобрать материал</button>}

      {isActive && withMaterials && item.materials.length > 0 && (
        <div className="mt-2 pt-2 border-t border-blue-200/40 dark:border-blue-800/20">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"><Package className="h-3.5 w-3.5" />Материалы (с наценкой 20%)</p>
          <div className="space-y-1">
            {item.materials.map((m, i) => {
              const mCost = Math.round(m.consumption * (qty || 0) * m.price * 1.2);
              return (
                <div key={i} className="flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground">{m.name} · <span className="font-mono">{m.consumption} {m.unit}/{item.unit}</span> · {m.price} ₽</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0">{mCost.toLocaleString("ru-RU")} ₽</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CalcGroup({ group, mode, quantities, withMaterials, onChange, onMaterialRequest }) {
  const [open, setOpen] = useState(false);
  const groupTotal = group.items.reduce((s, item) => {
    const price = mode === "dismount" ? item.dismount : item.mount;
    const qty = quantities[item.id] || 0;
    let mat = 0;
    if (withMaterials && qty) mat = item.materials.reduce((ms, m) => ms + m.consumption * qty * m.price * 1.2, 0);
    return s + price * qty + mat;
  }, 0);
  const hasValues = Object.values(quantities).some(v => v > 0);

  return (
    <div className="calc-work-group border-b border-primary/15 last:border-b-0 bg-[#fffaf3]">
      <button
        onClick={() => setOpen(o => !o)}
        className={`calc-work-group-trigger w-full flex items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-orange-100/55 ${open ? 'bg-orange-50/75 shadow-[inset_3px_0_0_hsl(var(--primary))]' : hasValues ? 'bg-orange-50/50' : ''}`}
      >
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`} />
        <span className="text-sm font-semibold text-foreground flex-1">{group.name}</span>
        {groupTotal > 0 && (
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{groupTotal.toLocaleString("ru-RU")} ₽</span>
        )}
      </button>
      {open && (
        <div className="calc-work-items border-t border-primary/10 bg-[#fffdfa] px-1.5 py-1.5">
          {group.items.map(item => (
            <CalcItem
              key={item.id}
              item={item}
              mode={mode}
              qty={quantities[item.id] || 0}
              withMaterials={withMaterials}
              onChange={v => onChange(item.id, v)}
              onMaterialRequest={onMaterialRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalcCategory({ category, quantities, withMaterials, onChange, onMaterialRequest, isOpen, hideHeader = false }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = isOpen ?? localOpen;
  const mode = "mount";

  const categoryTotal = category.groups.reduce((cs, group) =>
    cs + group.items.reduce((gs, item) => {
      const price = item.mount;
      const qty = quantities[item.id] || 0;
      let mat = 0;
      if (withMaterials && qty) mat = item.materials.reduce((ms, m) => ms + m.consumption * qty * m.price * 1.2, 0);
      return gs + price * qty + mat;
    }, 0)
  , 0);

  return (
    <div className="rb-card overflow-hidden rounded-2xl">
      {!hideHeader && <button
        onClick={() => setLocalOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          <h3 className="text-base font-bold text-foreground">{category.name}</h3>
          {categoryTotal > 0 && (
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-lg">
              {categoryTotal.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>}

      {open && (
        <div className="border-t border-border">
          {category.groups.map(group => (
            <CalcGroup
              key={group.id}
              group={group}
              mode={mode}
              quantities={quantities}
              withMaterials={withMaterials}
              onChange={onChange}
              onMaterialRequest={onMaterialRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

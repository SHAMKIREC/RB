import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function CalcItem({ item, mode, qty, withMaterials, onChange }) {
  const price = mode === "dismount" ? item.dismount : item.mount;
  const workTotal = price * (qty || 0);

  let matTotal = 0;
  if (withMaterials && qty) {
    matTotal = item.materials.reduce((s, m) => s + m.consumption * qty * m.price * 1.2, 0);
  }
  const lineTotal = workTotal + matTotal;
  const isActive = qty > 0;

  return (
    <div className={`px-4 py-3 border-b border-border/40 last:border-b-0 transition-colors ${isActive ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-secondary/30"}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground"}`}>
            {item.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">
              {price > 0 ? `${price.toLocaleString("ru-RU")} ₽ / ${item.unit}` : "—"}
            </span>
            {withMaterials && item.materials.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-medium">+ материалы</span>
            )}
          </div>
        </div>

        {price > 0 ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
              <button
                onClick={() => onChange(Math.max(0, (qty || 0) - 1))}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-lg font-bold"
              >−</button>
              <input
                type="number"
                min="0"
                value={qty || ""}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-16 h-8 bg-transparent font-mono text-sm text-foreground text-center focus:outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => onChange((qty || 0) + 1)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-lg font-bold"
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

      {/* Materials detail breakdown */}
      {isActive && withMaterials && item.materials.length > 0 && (
        <div className="mt-2 pt-2 border-t border-blue-200/40 dark:border-blue-800/20">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wider">📦 Материалы (с наценкой 20%)</p>
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

function CalcGroup({ group, mode, quantities, withMaterials, onChange }) {
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
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-secondary/20 ${hasValues ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}
      >
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`} />
        <span className="text-sm font-semibold text-foreground flex-1">{group.name}</span>
        {groupTotal > 0 && (
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{groupTotal.toLocaleString("ru-RU")} ₽</span>
        )}
      </button>
      {open && (
        <div className="bg-background/50">
          {group.items.map(item => (
            <CalcItem
              key={item.id}
              item={item}
              mode={mode}
              qty={quantities[item.id] || 0}
              withMaterials={withMaterials}
              onChange={v => onChange(item.id, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalcCategory({ category, quantities, withMaterials, onChange }) {
  const [open, setOpen] = useState(false);
  const mode = "mount";

  const categoryTotal = category.groups.reduce((cs, group) =>
    cs + group.items.reduce((gs, item) => {
      const price = mode === "dismount" ? item.dismount : item.mount;
      const qty = quantities[item.id] || 0;
      let mat = 0;
      if (withMaterials && qty) mat = item.materials.reduce((ms, m) => ms + m.consumption * qty * m.price * 1.2, 0);
      return gs + price * qty + mat;
    }, 0)
  , 0);

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-secondary/30 transition-colors"
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
      </button>

      {open && (
        <div className="border-t border-border">


          {/* Groups */}
          {category.groups.map(group => (
            <CalcGroup
              key={group.id}
              group={group}
              mode={mode}
              quantities={quantities}
              withMaterials={withMaterials}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
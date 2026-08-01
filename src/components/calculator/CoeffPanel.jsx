import { COEFFICIENTS } from "../../lib/calcData";

export default function CoeffPanel({ active, onChange }) {
  const total = active.reduce((s, id) => {
    const c = COEFFICIENTS.find(c => c.id === id);
    return s + (c ? c.value : 0);
  }, 0);

  return (
    <div className="border border-border rounded-2xl bg-card p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">Коэффициенты сложности</h3>
        {total > 0 && (
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1 rounded-lg">
            +{Math.round(total * 100)}%
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {COEFFICIENTS.map(coeff => {
          const isOn = active.includes(coeff.id);
          return (
            <button
              key={coeff.id}
              onClick={() => {
                if (isOn) onChange(active.filter(id => id !== coeff.id));
                else onChange([...active, coeff.id]);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all text-sm ${
                isOn ? "border-primary bg-primary/10 text-primary font-bold" : "border-border hover:border-primary/40 text-foreground"
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${isOn ? "bg-primary border-primary" : "border-border"}`}>
                {isOn && <span className="text-white text-xs">✓</span>}
              </div>
              <span>{coeff.label}</span>
              <span className={`ml-auto text-xs font-mono ${isOn ? "text-primary" : "text-muted-foreground"}`}>+{Math.round(coeff.value * 100)}%</span>
            </button>
          );
        })}
      </div>
      {total > 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          Итоговая стоимость будет увеличена на {Math.round(total * 100)}% по выбранным коэффициентам
        </p>
      )}
    </div>
  );
}
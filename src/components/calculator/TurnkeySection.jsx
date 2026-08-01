import { useState } from "react";
import { TURNKEY_OPTIONS } from "../../lib/servicesData";

export default function TurnkeySection({ onTotalChange }) {
  const [selected, setSelected] = useState(null);
  const [area, setArea] = useState("");

  const handleSelect = (id) => {
    const newSelected = selected === id ? null : id;
    setSelected(newSelected);
    if (newSelected && area) {
      const option = TURNKEY_OPTIONS.find((o) => o.id === newSelected);
      onTotalChange(option.price * parseFloat(area));
    } else {
      onTotalChange(0);
    }
  };

  const handleArea = (val) => {
    setArea(val);
    if (selected && val) {
      const option = TURNKEY_OPTIONS.find((o) => o.id === selected);
      onTotalChange(option.price * parseFloat(val));
    } else {
      onTotalChange(0);
    }
  };

  return (
    <div className="border border-border rounded-2xl bg-card p-5 sm:p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Ремонт под ключ</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {TURNKEY_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selected === option.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="text-sm font-bold text-foreground">{option.name}</div>
            <div className="text-xl font-mono font-bold text-primary mt-1">
              {option.price.toLocaleString("ru-RU")} ₽
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">за {option.unit}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Площадь помещения (м²)
          </label>
          <input
            type="number"
            min="0"
            value={area}
            onChange={(e) => handleArea(e.target.value)}
            placeholder="0"
            className="w-full sm:w-48 px-4 py-3 bg-secondary border border-border rounded-xl font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}
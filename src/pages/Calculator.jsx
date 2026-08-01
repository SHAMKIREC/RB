import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CALC_CATEGORIES, COEFFICIENTS } from "../lib/calcData";
import CalcCategory from "../components/calculator/CalcCategory";
import NewTurnkey from "../components/calculator/NewTurnkey";
import CoeffPanel from "../components/calculator/CoeffPanel";
import NewFloatingBill from "../components/calculator/NewFloatingBill";

export default function Calculator() {
  const [quantities, setQuantities] = useState({});
  const [turnkeyTotal, setTurnkeyTotal] = useState(0);
  const [activeCoeffs, setActiveCoeffs] = useState([]);

  const handleChange = (itemId, value) => {
    setQuantities(prev => ({ ...prev, [itemId]: value }));
  };

  const { workTotal, matTotal, breakdown } = useMemo(() => {
    const items = [];
    let work = 0;

    CALC_CATEGORIES.forEach(cat => {
      cat.groups.forEach(group => {
        group.items.forEach(item => {
          const qty = quantities[item.id] || 0;
          if (qty > 0) {
            const lineWork = item.mount * qty;
            work += lineWork;
            items.push({ name: `${cat.name} → ${item.name}`, total: lineWork });
          }
        });
      });
    });

    if (turnkeyTotal > 0) {
      items.push({ name: "Ремонт под ключ", total: turnkeyTotal });
      work += turnkeyTotal;
    }

    return { workTotal: work, matTotal: 0, breakdown: items };
  }, [quantities, turnkeyTotal]);

  const coeffPercent = activeCoeffs.reduce((s, id) => {
    const c = COEFFICIENTS.find(c => c.id === id);
    return s + (c ? c.value : 0);
  }, 0);
  const coeffTotal = workTotal * (1 + coeffPercent);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <p className="text-sm font-mono text-primary font-bold uppercase tracking-widest mb-2">Расчёт стоимости</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3">Калькулятор-смета</h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Профессиональный расчёт стоимости ремонта. Выберите категорию, укажите объём — получите точную смету.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left */}
        <div className="flex-1 space-y-4">
          {/* Turnkey */}
          <NewTurnkey onTotalChange={(val) => setTurnkeyTotal(val)} />

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-4 text-xs text-muted-foreground font-mono uppercase tracking-widest">или отдельные работы</span></div>
          </div>

          {/* Categories — без демонтажа */}
          {CALC_CATEGORIES.filter(cat => cat.id !== "demolition").map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <CalcCategory
                category={cat}
                quantities={quantities}
                withMaterials={false}
                onChange={handleChange}
              />
            </motion.div>
          ))}

          {/* Coefficients */}
          <CoeffPanel active={activeCoeffs} onChange={setActiveCoeffs} />
        </div>

        {/* Right — bill */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <NewFloatingBill
            workTotal={workTotal}
            matTotal={0}
            coeffTotal={coeffTotal}
            breakdown={breakdown}
            coeffPercent={coeffPercent}
            withMaterials={false}
          />
        </div>
      </div>
    </div>
  );
}
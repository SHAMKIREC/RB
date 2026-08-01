import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { SERVICES_CATALOG } from "../lib/servicesCatalog";

function PriceTable({ items }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <table className="w-full">
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className={`border-b border-border/50 last:border-b-0 ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"}`}>
              <td className="px-4 py-3 text-sm text-foreground">{item.name}</td>
              <td className="px-4 py-3 text-sm font-mono font-bold text-primary text-right whitespace-nowrap">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubcategoryGrid({ subcategories, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subcategories.map((sub, i) => (
        <motion.button
          key={sub.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          onClick={() => onSelect(sub)}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-primary/30 transition-all text-left"
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <span className="font-bold text-white text-base">{sub.name}</span>
            <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function CategoryGrid({ categories, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(cat)}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-left"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-2">
            <span className="font-bold text-white text-sm leading-tight">{cat.name}</span>
            <ChevronRight className="w-4 h-4 text-white/80 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const breadcrumb = [
    { label: "Все услуги", onClick: () => { setSelectedCategory(null); setSelectedSubcategory(null); } },
    selectedCategory && { label: selectedCategory.name, onClick: () => setSelectedSubcategory(null) },
    selectedSubcategory && { label: selectedSubcategory.name, onClick: null },
  ].filter(Boolean);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
              {crumb.onClick ? (
                <button onClick={crumb.onClick} className="hover:text-primary transition-colors font-medium">{crumb.label}</button>
              ) : (
                <span className="text-foreground font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>

        {selectedCategory ? (
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="flex items-center justify-center w-10 h-10 rounded-xl border border-border hover:bg-secondary transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-sm font-mono text-primary font-bold uppercase tracking-widest">{selectedSubcategory ? selectedCategory.name : "Каталог"}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                {selectedSubcategory ? selectedSubcategory.name : selectedCategory.name}
              </h1>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-mono text-primary font-bold uppercase tracking-widest mb-2">Каталог</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3">Все услуги</h1>
            <p className="text-muted-foreground text-base max-w-2xl">Полный спектр строительных и ремонтных работ в Саратове. Нажмите на категорию — узнайте цены.</p>
          </>
        )}
      </motion.div>

      {/* Content */}
      {!selectedCategory && (
        <CategoryGrid categories={SERVICES_CATALOG} onSelect={handleCategorySelect} />
      )}

      {selectedCategory && !selectedSubcategory && (
        <>
          {selectedCategory.direct ? (
            <PriceTable items={selectedCategory.items} />
          ) : (
            <SubcategoryGrid subcategories={selectedCategory.subcategories} onSelect={setSelectedSubcategory} />
          )}
        </>
      )}

      {selectedSubcategory && (
        <PriceTable items={selectedSubcategory.items} />
      )}
    </div>
  );
}
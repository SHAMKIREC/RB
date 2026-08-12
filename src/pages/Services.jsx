import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { SERVICES_CATALOG } from "../lib/servicesCatalog";
import { formatCategoryPrice } from "../lib/servicesData";
import ServiceSeo from "../components/ServiceSeo";
import { getServiceCategoryPrice, getServiceItemPrice, setPriceOverride } from "../lib/pricingStorage";
import { useInlineEditMode, usePricingOverrides } from "../hooks/usePricingState";
import InlinePriceEditor from "../components/admin/InlinePriceEditor";

function PriceTable({ items }) {
  const overrides = usePricingOverrides();
  const inlineEditMode = useInlineEditMode();

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <table className="w-full">
        <tbody>
          {items.map((item, i) => {
            const price = getServiceItemPrice(item, overrides);
            return <tr key={item.id} className={`border-b border-border/50 last:border-b-0 ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"}`}>
              <td className="px-4 py-3 text-sm text-foreground">{item.name}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="inline-flex flex-col items-end">
                  <span className="text-sm font-mono font-bold text-primary">{price.toLocaleString("ru-RU")} ₽{item.unit ? ` / ${item.unit}` : ""}</span>
                  {inlineEditMode && <InlinePriceEditor value={price} onSave={(value) => setPriceOverride(item.pricingScope || 'serviceItems', item.pricingId || item.id, value)} />}
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

function SubcategoryGrid({ subcategories, onSelect }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${subcategories.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-4`}>
      {subcategories.map((sub, i) => (
        <motion.button
          key={sub.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          onClick={() => onSelect(sub)}
          className="group relative overflow-hidden rounded-2xl border-2 border-primary/70 bg-card shadow-sm hover:shadow-lg hover:border-primary transition-all text-left"
        >
          <div className="aspect-[16/9] overflow-hidden">
            <img src={sub.image} alt={sub.imageAlt} loading="lazy" decoding="async" width="800" height="450" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
  const overrides = usePricingOverrides();
  const inlineEditMode = useInlineEditMode();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group relative overflow-hidden rounded-2xl border-2 border-primary/70 bg-card shadow-sm hover:shadow-xl hover:border-primary transition-all text-left"
        >
          <button type="button" onClick={() => onSelect(cat)} className="block w-full text-left">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={cat.image} alt={cat.imageAlt} loading="lazy" decoding="async" width="800" height="600" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
              <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg">
                <span className="text-xs font-mono font-bold text-primary">{formatCategoryPrice(cat, getServiceCategoryPrice(cat, overrides))}</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-2">
              <span className="font-bold text-white text-sm leading-tight">{cat.name}</span>
              <ChevronRight className="w-4 h-4 text-white/80 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          {inlineEditMode && <div className="absolute top-10 right-2 z-10"><InlinePriceEditor value={getServiceCategoryPrice(cat, overrides)} onSave={(value) => setPriceOverride(cat.pricingScope || 'serviceCategories', cat.pricingId || cat.id, value)} /></div>}
        </motion.div>
      ))}
    </div>
  );
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = SERVICES_CATALOG.find((category) => category.id === searchParams.get("category")) || null;
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    setSelectedCategory(SERVICES_CATALOG.find((category) => category.id === searchParams.get("category")) || null);
    setSelectedSubcategory(null);
  }, [searchParams]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setSearchParams({ category: cat.id });
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
      setSearchParams({});
    }
  };

  const breadcrumb = [
    { label: "Все услуги", onClick: () => { setSelectedCategory(null); setSelectedSubcategory(null); setSearchParams({}); } },
    selectedCategory && { label: selectedCategory.name, onClick: () => setSelectedSubcategory(null) },
    selectedSubcategory && { label: selectedSubcategory.name, onClick: null },
  ].filter(Boolean);

  return (
    <div className="page-shell py-7 sm:py-10">
      <ServiceSeo category={selectedCategory} />
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5">
        {/* Breadcrumb */}
        {selectedCategory && <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
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
        </div>}

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
            <p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Каталог</p>
            <h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Все услуги</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">Полный спектр строительных и ремонтных работ в Саратове. Нажмите на категорию — узнайте цены.</p>
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

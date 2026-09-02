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
import { getServiceGallery, SERVICE_GALLERY_CHANGED_EVENT } from "../lib/serviceGalleryStorage";

function PriceTable({ items }) {
  const overrides = usePricingOverrides();
  const inlineEditMode = useInlineEditMode();

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-[#fff0df] p-2 shadow-[0_16px_38px_-28px_rgba(154,52,18,.65)] dark:border-primary/45 dark:bg-[#171311] dark:shadow-[0_18px_42px_-26px_rgba(0,0,0,.9)] sm:p-3">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="rounded-l-xl bg-primary px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-white">Работа</th>
            <th className="rounded-r-xl bg-primary px-4 py-3 text-right text-xs font-black uppercase tracking-wide text-white">Цена</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const price = getServiceItemPrice(item, overrides);
            const rowBg = i % 2 === 0 ? 'bg-white dark:bg-[#24201e]' : 'bg-[#fffaf5] dark:bg-[#1e1b19]';
            return <tr key={item.id}>
              <td className={`rounded-l-xl border-y border-l border-primary/15 px-4 py-3 text-sm font-semibold text-[#201b18] dark:border-primary/20 dark:text-[#f5eee8] ${rowBg}`}>{item.name}</td>
              <td className={`rounded-r-xl border-y border-r border-primary/15 px-4 py-3 text-right whitespace-nowrap dark:border-primary/20 ${rowBg}`}>
                <div className="inline-flex flex-col items-end">
                  <span className="text-sm font-mono font-black text-[#d9470b] dark:text-[#ff6a32] sm:text-base">{price.toLocaleString("ru-RU")} ₽{item.unit ? ` / ${item.unit}` : ""}</span>
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

function WorkGallery({ galleryKey, title }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    let active = true;
    const load = () => getServiceGallery(galleryKey).then((photos) => {
      if (active) setImages(photos);
    }).catch(() => {
      if (active) setImages([]);
    });
    const onChanged = (event) => {
      if (!event.detail?.serviceKey || event.detail.serviceKey === galleryKey) load();
    };
    load();
    window.addEventListener(SERVICE_GALLERY_CHANGED_EVENT, onChanged);
    return () => { active = false; window.removeEventListener(SERVICE_GALLERY_CHANGED_EVENT, onChanged); };
  }, [galleryKey]);
  return (
    <section className="mt-7">
      <div className="mb-3">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">Наши работы</p>
        <h2 className="text-xl sm:text-2xl font-black text-foreground">Реальные примеры: {title}</h2>
      </div>
      {images.length ? <div className={`grid gap-3 ${images.length > 2 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'}`}>
        {images.map((image, index) => (
          <figure key={image.id || image.path || index} className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${images.length === 3 && index === 0 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <img src={image.src} alt={`${title}: пример выполненной работы ${index + 1}`} loading="lazy" decoding="async" width="900" height="650" className="aspect-[4/3] h-full w-full object-cover" />
          </figure>
        ))}
      </div> : <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-white/75 px-5 py-8 text-center text-sm font-semibold text-muted-foreground dark:bg-card/70">Владелец скоро добавит фотографии выполненных работ.</div>}
    </section>
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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group relative overflow-hidden rounded-2xl border-2 border-primary/70 bg-card shadow-sm hover:shadow-xl hover:border-primary transition-all text-left"
        >
          <button type="button" onClick={() => onSelect(cat)} className="block w-full text-left">
            <div className="aspect-[16/10] overflow-hidden">
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
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
      setSearchParams({});
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const breadcrumb = [
    { label: "Все услуги", onClick: () => { setSelectedCategory(null); setSelectedSubcategory(null); setSearchParams({}); } },
    selectedCategory && { label: selectedCategory.name, onClick: () => setSelectedSubcategory(null) },
    selectedSubcategory && { label: selectedSubcategory.name, onClick: null },
  ].filter(Boolean);

  return (
    <div className="page-shell py-7 sm:py-10">
      <ServiceSeo category={selectedCategory} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5">
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

      {!selectedCategory && (
        <CategoryGrid categories={SERVICES_CATALOG} onSelect={handleCategorySelect} />
      )}

      {selectedCategory && !selectedSubcategory && (
        <>
          {selectedCategory.direct ? (
            <>
              <PriceTable items={selectedCategory.items} />
              <WorkGallery galleryKey={selectedCategory.id} title={selectedCategory.name} />
            </>
          ) : (
            <SubcategoryGrid subcategories={selectedCategory.subcategories} onSelect={handleSubcategorySelect} />
          )}
        </>
      )}

      {selectedSubcategory && (
        <>
          <PriceTable items={selectedSubcategory.items} />
          <WorkGallery galleryKey={selectedSubcategory.id} title={selectedSubcategory.name} />
        </>
      )}
    </div>
  );
}

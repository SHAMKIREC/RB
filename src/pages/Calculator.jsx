import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, ChevronRight, X, Calculator as CalculatorIcon, Construction } from 'lucide-react';
import { CALC_CATEGORIES } from '../lib/calcData';
import { MATERIALS, getMaterialsForWork } from '../lib/materialsData';
import { buildEstimateText, safeNumber } from '../lib/calculatorUtils';
import CalcCategory from '../components/calculator/CalcCategory';
import NewTurnkey from '../components/calculator/NewTurnkey';
import MaterialModal from '../components/calculator/MaterialModal';
import EstimateSidebar from '../components/calculator/EstimateSidebar';
import { disableInlineEditMode, getCalculatorWorkPrice, getMaterialPrice } from '../lib/pricingStorage';
import { useInlineEditMode, usePricingOverrides } from '../hooks/usePricingState';

const DRAFT_KEY = 'rb_calculator_draft';
const readDraft = () => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch { return {}; } };
const chunk = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));
const integerQuantity = (value) => Math.max(0, Math.round(safeNumber(value)));
const normalizeQuantities = (quantities) => Object.fromEntries(
  Object.entries(quantities || {}).map(([id, value]) => [id, integerQuantity(value)]),
);

const iconSvg = (paths) => function CustomCategoryIcon({ className }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths}</svg>;
};
const DemolitionIcon = iconSvg(<><path d="m14 5 5 5"/><path d="m12 7 5 5"/><path d="M4 20 15 9"/><path d="m3 4 4 1-2 4"/><path d="m18 16 3 3"/></>);
const RoughworksIcon = iconSvg(<><path d="M4 19V9l8-5 8 5v10"/><path d="M8 19v-6h8v6"/><path d="M3 19h18"/><path d="M7 9h10"/></>);
const FloorIcon = iconSvg(<><path d="m3 8 9-4 9 4-9 4Z"/><path d="m3 12 9 4 9-4"/><path d="m3 16 9 4 9-4"/></>);
const PlasterIcon = iconSvg(<><path d="M4 18h16"/><path d="M6 14h12l-2 4H8Z"/><path d="M12 14V7"/><path d="M8 7h8"/><path d="M9 4h6"/></>);
const PaintingIcon = iconSvg(<><path d="M5 4h10v5H5Z"/><path d="M15 6h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6v3"/><path d="M10 15h4v6h-4Z"/></>);
const TilingIcon = iconSvg(<><path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M4 13h7v7H4z"/><path d="M13 13h7v7h-7z"/></>);
const DrywallIcon = iconSvg(<><path d="M5 3h14v18H5z"/><path d="M12 3v18"/><path d="M8 7h1"/><path d="M15 7h1"/><path d="M8 17h1"/><path d="M15 17h1"/></>);
const CeilingIcon = iconSvg(<><path d="M3 6h18"/><path d="M5 6v5h14V6"/><path d="M8 11v4"/><path d="M16 11v4"/><path d="M6 19h12"/><path d="M8 15h8v4H8z"/></>);
const ElectricIcon = iconSvg(<path d="m13 2-8 12h7l-1 8 8-12h-7Z"/>);
const PlumbingIcon = iconSvg(<><path d="M4 17v-3a4 4 0 0 1 4-4h10"/><path d="M13 6h7v4h-7"/><path d="M17 6V4h-5"/><path d="M18 10v3"/><path d="M16.5 18c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1-1.6-3-2.5-4-.9 1-2.5 3-2.5 4Z"/></>);
const DoorIcon = iconSvg(<><path d="M5 21V3h12v18"/><path d="M8 21V6h6v15"/><path d="M12 13h.01"/><path d="M3 21h16"/></>);
const BalconyIcon = iconSvg(<><path d="M6 11V4h12v7"/><path d="M4 11h16v9H4Z"/><path d="M8 11v9"/><path d="M12 11v9"/><path d="M16 11v9"/></>);
const WeldingIcon = iconSvg(<><path d="M6 7h12l-1.5 12h-9Z"/><path d="M9 11h6v4H9z"/><path d="m4 4-1-1"/><path d="M12 3V1"/><path d="m20 4 1-1"/></>);
const CanopyIcon = iconSvg(<><path d="M3 10 7 5h10l4 5"/><path d="M5 10h14"/><path d="M7 10v10"/><path d="M17 10v10"/></>);
const StairsIcon = iconSvg(<path d="M4 19h4v-4h4v-4h4V7h4"/>);
const GazeboIcon = iconSvg(<><path d="m3 10 9-6 9 6"/><path d="M5 10h14"/><path d="M7 10v10"/><path d="M17 10v10"/><path d="M4 20h16"/></>);
const BathhouseIcon = iconSvg(<><path d="M4 11 12 5l8 6v9H4Z"/><path d="M9 20v-6h6v6"/><path d="M16 7V3h2v6"/><path d="M19 3c1-1 1-2 0-3"/><path d="M21 5c1-1 1-2 0-3"/></>);
const FenceIcon = iconSvg(<><path d="M5 3 8 6v15H5Z"/><path d="m16 6 3-3v18h-3Z"/><path d="M8 9h8"/><path d="M8 16h8"/></>);

const CATEGORY_ICONS = {
  demolition: DemolitionIcon, roughworks: RoughworksIcon, floor: FloorIcon, plaster: PlasterIcon,
  painting: PaintingIcon, tiling: TilingIcon, gkl: DrywallIcon, ceiling: CeilingIcon,
  electric: ElectricIcon, plumbing: PlumbingIcon, doors: DoorIcon, balcony: BalconyIcon,
  welding: WeldingIcon, fences: FenceIcon, canopies: CanopyIcon, stairs: StairsIcon,
  gazebo: GazeboIcon, bathhouse: BathhouseIcon,
};

function CategoryIcon({ category, className = "h-4 w-4" }) {
  const Icon = CATEGORY_ICONS[category.id] || Construction;
  return <Icon className={className} strokeWidth={2.2} />;
}

export default function Calculator() {
  const [draft] = useState(readDraft);
  const [quantities, setQuantities] = useState(() => normalizeQuantities(draft.quantities));
  const [turnkeyTotal, setTurnkeyTotal] = useState(draft.turnkeyTotal || 0);
  const [materialSelections, setMaterialSelections] = useState(draft.materialSelections || {});
  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [materialWork, setMaterialWork] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const skipDraftSave = useRef(false);
  const skipAutomaticReset = useRef(false);
  const pricingOverrides = usePricingOverrides();
  const inlineEditMode = useInlineEditMode();

  useEffect(() => {
    if (skipDraftSave.current) { skipDraftSave.current = false; return; }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ quantities, turnkeyTotal, materialSelections }));
  }, [quantities, turnkeyTotal, materialSelections]);
  useEffect(() => {
    if (turnkeyTotal === 0 && Object.keys(quantities).length === 0 && Object.keys(materialSelections).length === 0) {
      if (skipAutomaticReset.current) {
        skipAutomaticReset.current = false;
        return;
      }
      setQuery('');
      setActiveCategoryId(null);
      setMaterialWork(null);
      setResetSignal((value) => value + 1);
    }
  }, [quantities, turnkeyTotal, materialSelections]);

  const pricedCategories = useMemo(() => CALC_CATEGORIES.map((category) => ({ ...category, icon: <CategoryIcon category={category} />, groups: category.groups.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, mount: getCalculatorWorkPrice(item, pricingOverrides) })) })) })), [pricingOverrides]);
  const works = useMemo(() => pricedCategories.flatMap((category) => category.groups.flatMap((group) => group.items.map((item) => ({ ...item, category: category.name }))).filter((item) => integerQuantity(quantities[item.id]) > 0).map((item) => ({ ...item, quantity: integerQuantity(quantities[item.id]), price: item.mount, total: item.mount * integerQuantity(quantities[item.id]) }))), [pricedCategories, quantities]);
  const worksWithTurnkey = turnkeyTotal > 0 ? [...works, { id: 'turnkey', name: 'Ремонт под ключ', unit: '', quantity: 1, price: turnkeyTotal, total: turnkeyTotal }] : works;
  const worksSubtotal = worksWithTurnkey.reduce((sum, item) => sum + item.total, 0);
  const materialLines = useMemo(() => Object.entries(materialSelections).map(([workId, selection]) => {
    const materialId = typeof selection === 'string' ? selection : selection?.materialId;
    const sourceMaterial = MATERIALS.find((item) => item.id === materialId);
    const material = sourceMaterial ? { ...sourceMaterial, pricePerPackage: getMaterialPrice(sourceMaterial, pricingOverrides) } : null;
    const quantity = Math.max(1, Math.round(safeNumber(typeof selection === 'string' ? 1 : selection?.quantity) || 1));
    if (!material) return null;
    const total = material.pricePerPackage * quantity;
    return { workId, ...material, quantity, total };
  }).filter(Boolean), [materialSelections, pricingOverrides]);
  const materialsSubtotal = materialLines.reduce((sum, item) => sum + item.total, 0);
  const estimateText = useMemo(() => buildEstimateText({ works: worksWithTurnkey, materials: materialLines, worksSubtotal, materialsSubtotal }), [worksWithTurnkey, materialLines, worksSubtotal, materialsSubtotal]);
  const displayedCategories = useMemo(() => pricedCategories.map((category) => ({ ...category, groups: category.groups.map((group) => ({ ...group, items: group.items.filter((item) => !query || item.name.toLowerCase().includes(query.toLowerCase())) })).filter((group) => group.items.length) })).filter((category) => category.groups.length), [pricedCategories, query]);
  const activeCategory = displayedCategories.find((category) => category.id === activeCategoryId) || null;
  const categoryRows = chunk(displayedCategories, 4);
  const updateQuantity = (id, value) => setQuantities((current) => ({ ...current, [id]: integerQuantity(value) }));
  const clearDraft = (event) => {
    event.preventDefault();
    event.stopPropagation();
    skipDraftSave.current = true;
    skipAutomaticReset.current = true;
    localStorage.removeItem(DRAFT_KEY);
    setQuantities({});
    setTurnkeyTotal(0);
    setMaterialSelections({});
    setQuery('');
    setActiveCategoryId(null);
    setMaterialWork(null);
    setResetSignal((value) => value + 1);
  };

  return <div className="calculator-page pb-10 sm:pb-14">
    <div className="page-shell pt-7 sm:pt-10"><motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="catalog-page-hero mb-5"><p className="mb-1 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-primary"><CalculatorIcon className="h-4 w-4" /> Расчёт стоимости</p><h1 className="mb-2 text-3xl font-black sm:text-4xl">Калькулятор-смета</h1><p className="max-w-2xl text-sm text-white/65">Выберите работы и укажите объём — предварительная стоимость соберётся автоматически.</p></motion.section>{inlineEditMode && <button type="button" onClick={disableInlineEditMode} className="mb-5 rounded-xl border border-primary/35 bg-primary/10 px-4 py-2 text-xs font-bold text-primary">Выйти из режима редактирования</button>}</div>
    <div className="page-shell">
    <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_21rem] gap-5 lg:gap-6 items-start"><section className="min-w-0 space-y-3">
      <NewTurnkey resetSignal={resetSignal} onTotalChange={(value) => setTurnkeyTotal(safeNumber(value))} />
      <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3 shadow-[0_8px_22px_-18px_rgba(15,23,42,.45)]"><div className="flex flex-col sm:flex-row gap-2"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по работам" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-[#fffdfa] text-sm shadow-inner shadow-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label><button type="button" onClick={clearDraft} className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-secondary"><RotateCcw className="w-3.5 h-3.5" />Очистить</button></div></div>
      <div className="space-y-3">{categoryRows.map((row) => <div key={row[0].id} className="space-y-3"><div className="grid grid-cols-4 gap-1 sm:gap-1.5">{row.map((category) => { const selected = category.id === activeCategoryId; const selectedItems = category.groups.flatMap((group) => group.items).filter((item) => safeNumber(quantities[item.id]) > 0); const total = selectedItems.reduce((sum, item) => sum + item.mount * safeNumber(quantities[item.id]), 0); return <button key={category.id} onClick={() => setActiveCategoryId(category.id)} className={`relative min-h-[110px] sm:min-h-[124px] lg:min-h-[132px] overflow-hidden rounded-xl border p-1.5 sm:p-3 lg:p-4 text-left shadow-[0_6px_18px_-15px_rgba(15,23,42,.55)] transition-all hover:-translate-y-0.5 ${selected ? 'border-primary bg-[linear-gradient(145deg,#fff7ea_0%,#fff0d8_100%)] shadow-[0_12px_24px_-16px_rgba(234,88,12,.5)] ring-1 ring-primary/25' : 'border-slate-200/90 bg-white hover:border-primary/60 hover:shadow-md'}`}><span className={`flex w-5 h-5 sm:w-8 sm:h-8 items-center justify-center rounded-lg text-[13px] sm:text-xl ${selected ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-primary/10'}`}>{category.icon}</span><span className="mt-1.5 sm:mt-2 block text-[9px] sm:text-xs lg:text-sm font-bold text-foreground leading-tight line-clamp-2">{category.name}</span><span className="mt-1 block text-[8px] sm:text-[10px] text-muted-foreground leading-tight line-clamp-2">{category.groups[0]?.name}</span><span className="mt-1 block pr-3 text-[8px] sm:text-[10px] font-mono text-foreground">{selectedItems.length ? `${selectedItems.length} · ${Math.round(total).toLocaleString('ru-RU')} ₽` : `${category.groups.reduce((sum, group) => sum + group.items.length, 0)} работ`}</span>{selected && <span className="absolute top-1 right-1 rounded-md bg-primary px-1 py-0.5 text-[7px] sm:text-[9px] font-bold text-white shadow-sm">Открыто</span>}<ChevronRight className={`absolute right-1 bottom-1 w-3 h-3 sm:w-4 sm:h-4 text-primary transition-transform ${selected ? 'rotate-90' : ''}`} /></button>; })}</div>{row.some((category) => category.id === activeCategoryId) && activeCategory && <section className="calc-active-surface overflow-hidden rounded-2xl border border-primary/25 bg-[#fffdfa] shadow-[0_14px_28px_-20px_rgba(15,23,42,.5)]"><div className="calc-active-surface flex items-center justify-between gap-3 border-b border-primary/15 bg-[linear-gradient(90deg,#fff4e3_0%,#fffaf2_100%)] px-3 py-3"><div className="flex items-center gap-2 min-w-0"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-base">{activeCategory.icon}</span><h2 className="text-sm sm:text-base font-black truncate">{activeCategory.name}</h2></div><button onClick={() => setActiveCategoryId(null)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-muted-foreground hover:bg-white/80 hover:text-foreground"><X className="w-3.5 h-3.5" />Свернуть</button></div><CalcCategory category={activeCategory} quantities={quantities} withMaterials={false} onChange={updateQuantity} onMaterialRequest={setMaterialWork} isOpen hideHeader /></section>}</div>)}</div>
      {!activeCategory && <div className="border border-dashed border-border rounded-2xl px-4 py-5 text-center text-sm text-muted-foreground">Выберите категорию работ.</div>}
    </section><div className="min-w-0"><EstimateSidebar works={worksWithTurnkey} materials={materialLines} worksSubtotal={worksSubtotal} materialsSubtotal={materialsSubtotal} estimateText={estimateText} onRemoveWork={(id) => id === 'turnkey' ? setTurnkeyTotal(0) : updateQuantity(id, 0)} onRemoveMaterial={(workId) => setMaterialSelections((current) => { const next = { ...current }; delete next[workId]; return next; })} /></div></div>
    <MaterialModal work={materialWork} materials={materialWork ? getMaterialsForWork(materialWork.id).map((material) => ({ ...material, pricePerPackage: getMaterialPrice(material, pricingOverrides) })) : []} onClose={() => setMaterialWork(null)} onAdd={(material, quantity) => { const unitPrice = getMaterialPrice(material, pricingOverrides); const selectedQuantity = Math.max(1, Math.round(safeNumber(quantity) || 1)); setMaterialSelections((current) => ({ ...current, [materialWork.id]: { materialId: material.id, quantity: selectedQuantity, unitPrice, total: unitPrice * selectedQuantity } })); setMaterialWork(null); }} />
    </div>
  </div>;
}

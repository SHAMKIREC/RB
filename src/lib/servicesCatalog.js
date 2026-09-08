import { SERVICES_CATALOG as BASE_SERVICES_CATALOG } from './servicesData';
import { RAMIL_SERVICE_SECTIONS, RAMIL_TURNKEY_NOTE } from './ramilServicesCatalog';
import { RAMIL_SERVICE_CORRECTIONS } from './ramilServiceCorrections';
import wallDecorImage from '../assets/images/services/steny_finishnaya_otdelka.webp';
import wallSlopesImage from '../assets/images/services/steny_podgotovka.webp';
import ceilingStretchImage from '../assets/images/services/09_potolki.webp';
import ceilingPaintImage from '../assets/images/services/remont_potolka.webp';
import turnkeyCosmeticImage from '../assets/images/services/remont_kvartiry2.webp';
import turnkeyCapitalImage from '../assets/images/services/11_remont_pod_klyuch.webp';

const GROUPED_ORDER = {
  walls: ['walls_plaster', 'walls_paint', 'walls_wallpaper', 'walls_decor', 'walls_slopes'],
  ceilings: ['ceilings_stretch', 'ceilings_paint'],
  floors: ['floors_base', 'floors_finish', 'floors_plinth'],
  plumbing: ['plumbing_install', 'plumbing_system'],
  turnkey: ['turnkey_cosmetic', 'turnkey_capital', 'turnkey_design'],
};

const RAMIL_SUBCATEGORY_IMAGES = {
  walls_decor: wallDecorImage,
  walls_slopes: wallSlopesImage,
  ceilings_stretch: ceilingStretchImage,
  ceilings_paint: ceilingPaintImage,
  turnkey_cosmetic: turnkeyCosmeticImage,
  turnkey_capital: turnkeyCapitalImage,
  turnkey_design: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=82',
};

const toServiceItem = (categoryId, sectionId, row, index) => {
  const [name, price, unit] = row;
  const id = `ramil_${categoryId}_${sectionId}_${index + 1}`;
  return {
    id,
    name,
    price: Number(price) || 0,
    unit: unit || '',
    pricingScope: 'serviceItems',
    pricingId: id,
  };
};

const sectionMapFor = (sections = []) => new Map(sections.map((section) => [section.id, section]));

const mergeRamilSections = (baseSections = [], correctionSections = []) => {
  const result = baseSections.map((section) => ({
    ...section,
    items: [...(section.items || [])],
  }));
  const byId = new Map(result.map((section) => [section.id, section]));

  correctionSections.forEach((correction) => {
    const current = byId.get(correction.id);
    if (current) {
      current.items.push(...(correction.items || []));
      if (correction.details) current.details = correction.details;
      if (correction.note) current.note = correction.note;
      return;
    }
    const added = { ...correction, items: [...(correction.items || [])] };
    result.push(added);
    byId.set(added.id, added);
  });

  return result;
};

const makeRamilSubcategory = (category, section) => ({
  id: section.id,
  name: section.name,
  image: RAMIL_SUBCATEGORY_IMAGES[section.id] || category.image,
  imageAlt: `${category.imageAlt || category.name}: ${section.name}`,
  details: section.details,
  note: section.note || (section.id === 'turnkey_design' ? RAMIL_TURNKEY_NOTE : undefined),
  items: section.items.map((row, index) => toServiceItem(category.id, section.id, row, index)),
});

const withRamilPriceFrom = (category, sections) => {
  const rows = sections.flatMap((section) => section.items || []);
  if (!rows.length) return category;
  const [, price, unit] = rows.reduce((best, row) => Number(row[1]) < Number(best[1]) ? row : best, rows[0]);
  const value = Number(price) || category.priceFromValue || 0;
  const suffix = unit ? `/${unit}` : '';
  return {
    ...category,
    priceFrom: `от ${value.toLocaleString('ru-RU')} ₽${suffix}`,
    priceFromValue: value,
    priceFromSuffix: suffix,
  };
};

const mergeCategory = (category) => {
  const ramilSections = mergeRamilSections(
    RAMIL_SERVICE_SECTIONS[category.id] || [],
    RAMIL_SERVICE_CORRECTIONS[category.id] || [],
  );
  if (!ramilSections.length) return category;

  const groupedOrder = GROUPED_ORDER[category.id];
  const pricedCategory = withRamilPriceFrom(category, ramilSections);

  // Категории без нумерованных подпунктов остаются обычными длинными списками,
  // как в старом интерфейсе. Никаких «Основных работ» не создаём.
  if (!groupedOrder) {
    const rows = ramilSections.flatMap((section) => section.items || []);
    return {
      ...pricedCategory,
      direct: true,
      subcategories: undefined,
      items: rows.map((row, index) => toServiceItem(category.id, 'main', row, index)),
    };
  }

  const ramilById = sectionMapFor(ramilSections);
  const existingById = new Map((category.subcategories || []).map((section) => [section.id, section]));

  const subcategories = groupedOrder.map((sectionId) => {
    const ramil = ramilById.get(sectionId);
    if (ramil) {
      const existing = existingById.get(sectionId);
      return {
        ...makeRamilSubcategory(category, ramil),
        image: RAMIL_SUBCATEGORY_IMAGES[sectionId] || existing?.image || category.image,
        imageAlt: existing?.imageAlt || `${category.imageAlt || category.name}: ${ramil.name}`,
      };
    }

    const existing = existingById.get(sectionId);
    return existing ? { ...existing, items: [...(existing.items || [])] } : null;
  }).filter(Boolean);

  return {
    ...pricedCategory,
    direct: false,
    items: undefined,
    subcategories,
  };
};

export const SERVICES_CATALOG = BASE_SERVICES_CATALOG.map(mergeCategory);

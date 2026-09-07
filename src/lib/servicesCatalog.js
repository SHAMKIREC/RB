import { SERVICES_CATALOG as BASE_SERVICES_CATALOG } from './servicesData';
import { RAMIL_SERVICE_SECTIONS } from './ramilServicesCatalog';

const GROUPED_ORDER = {
  walls: ['walls_plaster', 'walls_paint', 'walls_wallpaper', 'walls_decor', 'walls_slopes'],
  ceilings: ['ceilings_stretch', 'ceilings_paint'],
  floors: ['floors_base', 'floors_finish', 'floors_plinth'],
  plumbing: ['plumbing_install', 'plumbing_system'],
  turnkey: ['turnkey_cosmetic', 'turnkey_capital', 'turnkey_design'],
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

const makeRamilSubcategory = (category, section) => ({
  id: section.id,
  name: section.name,
  image: category.image,
  imageAlt: `${category.imageAlt || category.name}: ${section.name}`,
  details: section.details,
  items: section.items.map((row, index) => toServiceItem(category.id, section.id, row, index)),
});

const withRamilPriceFrom = (category, sections) => {
  const rows = sections.flatMap((section) => section.items || []);
  if (!rows.length) return category;
  const [name, price, unit] = rows.reduce((best, row) => Number(row[1]) < Number(best[1]) ? row : best, rows[0]);
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
  const ramilSections = RAMIL_SERVICE_SECTIONS[category.id];
  if (!ramilSections?.length) return category;

  const groupedOrder = GROUPED_ORDER[category.id];
  const pricedCategory = withRamilPriceFrom(category, ramilSections);

  // Категории без нумерованных подпунктов остаются обычными длинными карточками,
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
        image: existing?.image || category.image,
        imageAlt: existing?.imageAlt || `${category.imageAlt || category.name}: ${ramil.name}`,
      };
    }

    // В присланном тексте Рамиля нет отдельного прайса 2.2 «Малярные работы»,
    // поэтому оставляем уже существующий список этой подкатегории, ничего не выдумывая.
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

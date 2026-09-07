import { SERVICES_CATALOG as BASE_SERVICES_CATALOG } from './servicesData';
import { CALC_CATEGORIES } from './calcDataRamilFinal';

const normalizeName = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/ё/g, 'е')
  .replace(/[–—]/g, '-')
  .replace(/\s+/g, ' ');

const CALC_TO_SERVICE = {
  demolition: 'demolition',
  roughworks: 'floors',
  floor: 'floors',
  plaster: 'walls',
  painting: 'walls',
  ceiling: 'ceilings',
  tiling: 'tiles',
  doors: 'doors',
  plumbing: 'plumbing',
  electric: 'electric',
  gkl: 'drywall',
  balcony: 'balcony',
  welding: 'metal',
  fences: 'fences',
  canopies: 'canopies',
  stairs: 'stairs',
  gazebo: 'gazebos',
  bathhouse: 'bathhouses',
};

const calcByService = CALC_CATEGORIES.reduce((result, category) => {
  const serviceId = CALC_TO_SERVICE[category.id];
  if (!serviceId) return result;
  if (!result[serviceId]) result[serviceId] = [];
  result[serviceId].push(category);
  return result;
}, {});

const existingItemsOf = (category) => category.direct
  ? (category.items || [])
  : (category.subcategories || []).flatMap((sub) => sub.items || []);

const asSubcategories = (category) => {
  if (!category.direct) return (category.subcategories || []).map((sub) => ({ ...sub, items: [...(sub.items || [])] }));
  return [{
    id: `${category.id}_main`,
    name: 'Основные работы',
    image: category.image,
    imageAlt: category.imageAlt,
    items: [...(category.items || [])],
  }];
};

const toServiceItem = (serviceId, groupId, item, index) => ({
  id: `ramil_${serviceId}_${groupId}_${item.id || index}`,
  name: item.name,
  price: Number(item.mount) || 0,
  unit: item.unit || '',
  pricingScope: 'serviceItems',
  pricingId: `ramil_${serviceId}_${item.id || `${groupId}_${index}`}`,
});

const mergeCategory = (category) => {
  const calcCategories = calcByService[category.id];
  if (!calcCategories?.length) return category;

  const existingNames = new Set(existingItemsOf(category).map((item) => normalizeName(item.name)));
  const subcategories = asSubcategories(category);
  const subByName = new Map(subcategories.map((sub) => [normalizeName(sub.name), sub]));

  calcCategories.forEach((calcCategory) => {
    calcCategory.groups.forEach((group) => {
      const newItems = group.items
        .filter((item) => !existingNames.has(normalizeName(item.name)))
        .map((item, index) => {
          existingNames.add(normalizeName(item.name));
          return toServiceItem(category.id, group.id, item, index);
        });

      if (!newItems.length) return;

      const key = normalizeName(group.name);
      const current = subByName.get(key);
      if (current) {
        current.items = [...current.items, ...newItems];
        return;
      }

      const sub = {
        id: `ramil_${category.id}_${group.id}`,
        name: group.name,
        image: category.image,
        imageAlt: `${category.imageAlt || category.name}: ${group.name}`,
        items: newItems,
      };
      subcategories.push(sub);
      subByName.set(key, sub);
    });
  });

  const totalItems = subcategories.reduce((sum, sub) => sum + sub.items.length, 0);
  if (!totalItems) return category;

  // The full price list is grouped into subcategories so a large catalogue remains readable.
  return {
    ...category,
    direct: false,
    items: undefined,
    subcategories,
  };
};

export const SERVICES_CATALOG = BASE_SERVICES_CATALOG.map(mergeCategory);

import { CALC_CATEGORIES } from './calcData';

const KEY = 'rb_orders_mvp';
const DEMO_IDS = new Set(['demo-order-1001', 'demo-order-1002', 'demo-order-1003']);

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const write = (orders) => localStorage.setItem(KEY, JSON.stringify(orders));
const integerQuantity = (value) => Math.max(0, Math.round(Number(value) || 0));
const normalizeSelectedWorks = (works) => Array.isArray(works)
  ? works.map((work) => {
      const quantity = integerQuantity(work.quantity);
      return {
        ...work,
        quantity,
        totalPrice: Number(work.unitPrice || 0) * quantity,
      };
    })
  : [];
const calculatorWorks = CALC_CATEGORIES.flatMap((category) => category.groups.flatMap((group) => group.items.map((item) => ({
  workId: item.id, categoryId: category.id, groupId: group.id, title: item.name, unit: item.unit, unitPrice: item.mount,
}))));

export const getOrders = () => read().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
export const getPublishedOrders = () => getOrders().filter((order) => order.isPublished && order.status === 'active');
export const getOrder = (id) => getOrders().find((order) => order.id === id);
export const getNextOrderNumber = () => Math.max(1046, ...getOrders().map((order) => Number(order.number) || 0)) + 1;
export const saveOrder = (order) => {
  const orders = read(); const now = new Date().toISOString();
  const next = { ...order, selectedWorks: normalizeSelectedWorks(order.selectedWorks), id: order.id || crypto.randomUUID(), number: order.number || getNextOrderNumber(), updatedAt: now, createdAt: order.createdAt || now };
  const index = orders.findIndex((item) => item.id === next.id);
  if (index >= 0) orders[index] = next; else orders.push(next);
  write(orders); return next;
};
export const deleteOrder = (id) => write(read().filter((order) => order.id !== id));
export const setOrderPublished = (id, isPublished) => {
  const order = getOrder(id);
  return order ? saveOrder({ ...order, isPublished, status: isPublished ? 'active' : 'draft' }) : null;
};
export const setOrderStatus = (id, status) => {
  const order = getOrder(id);
  return order ? saveOrder({ ...order, status, isPublished: status === 'active' ? order.isPublished : false }) : null;
};

const makeWorks = (specification) => specification.map(([workId, quantity]) => {
  const work = calculatorWorks.find((item) => item.workId === workId);
  if (!work) return null;
  return { ...work, quantity, totalPrice: work.unitPrice * quantity };
}).filter(Boolean);
const makeDemo = (id, number, title, location, description, preferredDeadline, specification) => {
  const selectedWorks = makeWorks(specification);
  const workSubtotal = selectedWorks.reduce((sum, work) => sum + work.totalPrice, 0);
  const now = new Date().toISOString();
  return { id, number, title, location, description, preferredDeadline, selectedWorks, workSubtotal, materialsSubtotal: 0, surcharges: 0, total: workSubtotal, photos: [], status: 'active', isPublished: true, isDemo: true, createdAt: now, updatedAt: now };
};

export const createDemoOrders = () => {
  const current = read();
  if (current.some((order) => DEMO_IDS.has(order.id))) return getOrders();
  const demos = [
    makeDemo('demo-order-1001', 1001, 'Ремонт комнаты', 'Люберцы, ул. Побратимов', 'Требуется аккуратная подготовка стен, поклейка обоев и укладка напольного покрытия.', 'По договорённости', [['paint_putty_wallpaper', 28], ['wp_no_match', 28], ['floor_laminate', 18]]),
    makeDemo('demo-order-1002', 1002, 'Ремонт санузла', 'Москва, Некрасовка', 'Комплекс работ по демонтажу старой отделки, укладке плитки и установке сантехники.', 'В ближайшие две недели', [['dem_tile_wall', 18], ['tile_300', 18], ['plumb_toilet', 1], ['plumb_mixer', 1]]),
    makeDemo('demo-order-1003', 1003, 'Монтаж забора', 'Московская область', 'Монтаж сварного забора с подготовкой основания и финишной покраской.', 'По договорённости', [['fence_weld', 30], ['fence_foundation', 30], ['fence_paint', 60]]),
  ];
  write([...current, ...demos]);
  return getOrders();
};
export const deleteDemoOrders = () => write(read().filter((order) => !DEMO_IDS.has(order.id)));

import { requireSupabase } from './supabaseClient';
import { errorMessage, removeFiles, signedImageUrl, signedUrls, STORAGE_BUCKETS, uploadOrderPhotos } from './mediaStorage';

const numberValue = (value) => Number(value || 0);
const camelWork = (row) => ({ workId: row.work_id, categoryId: row.category_id, groupId: row.group_id, title: row.title, unit: row.unit, unitPrice: numberValue(row.unit_price), quantity: numberValue(row.quantity), totalPrice: numberValue(row.total_price), sortOrder: row.sort_order });
const camelOrder = (row) => ({ id: row.id, number: row.number, title: row.title, location: row.location, description: row.description, preferredDeadline: row.preferred_deadline, selectedWorks: (row.order_works || row.selected_works || []).map(camelWork), workSubtotal: numberValue(row.work_subtotal), materialsSubtotal: numberValue(row.materials_subtotal), surcharges: numberValue(row.surcharges), calculatedCost: numberValue(row.calculated_cost), calculatedTotal: numberValue(row.calculated_total), finalTotal: numberValue(row.final_total), total: numberValue(row.total), contractorPayment: numberValue(row.contractor_payment), clientPrice: numberValue(row.client_price), ownerExpenses: numberValue(row.owner_expenses), expectedProfit: numberValue(row.expected_profit), photos: row.photos || [], status: row.status || 'draft', isPublished: row.is_published ?? true, isManualTotal: row.is_manual_total || false, isDemo: row.is_demo || false, createdAt: row.created_at, updatedAt: row.updated_at });

const withPhotoUrls = async (order, admin = false) => {
  const urls = await signedUrls(STORAGE_BUCKETS.orders, order.photos);
  return { ...order, photos: admin ? urls : urls.map((item) => item.src) };
};

const withCoverUrl = async (order) => {
  const cover = await signedImageUrl(STORAGE_BUCKETS.orders, order.photos?.[0]);
  return { ...order, photos: cover ? [cover] : [] };
};

export async function getOrders() {
  const { data, error } = await requireSupabase().from('orders').select('*, order_works(*)').order('updated_at', { ascending: false });
  if (error) throw new Error(`Database read error (orders): ${errorMessage(error)}`);
  return Promise.all((data || []).map((row) => withPhotoUrls(camelOrder(row), true)));
}

export async function getPublishedOrders(from = 0, to = 11) {
  const { data, error, count } = await requireSupabase().from('published_orders').select('id,number,title,location,description,preferred_deadline,contractor_payment,photos,created_at,updated_at,selected_works', { count: 'exact' }).order('updated_at', { ascending: false }).order('id', { ascending: false }).range(from, to);
  if (error) throw new Error(`Database read error (published orders): ${errorMessage(error)}`);
  const items = await Promise.all((data || []).map((row) => withCoverUrl(camelOrder({ ...row, status: 'active', is_published: true }))));
  return { items, hasMore: count == null ? items.length === to - from + 1 : from + items.length < count };
}

export async function getOrder(id) {
  const { data, error } = await requireSupabase().from('published_orders').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? withPhotoUrls(camelOrder({ ...data, status: 'active', is_published: true }), false) : null;
}


export async function saveOrder(order) {
  const client = requireSupabase();
  const id = order.id || crypto.randomUUID(); const isNew = !order.id;
  const { data: current, error: currentError } = order.id ? await client.from('orders').select('photos').eq('id', id).maybeSingle() : { data: null, error: null };
  if (currentError) throw new Error(`Не удалось прочитать фотографии заказа: ${errorMessage(currentError)}`);
  const payload = { id, title: order.title, location: order.location || '', description: order.description || '', preferred_deadline: order.preferredDeadline || '', work_subtotal: numberValue(order.workSubtotal), materials_subtotal: numberValue(order.materialsSubtotal), surcharges: numberValue(order.surcharges), calculated_cost: numberValue(order.calculatedCost), calculated_total: numberValue(order.calculatedTotal), final_total: numberValue(order.finalTotal), total: numberValue(order.total), contractor_payment: numberValue(order.contractorPayment), client_price: numberValue(order.clientPrice), owner_expenses: numberValue(order.ownerExpenses), expected_profit: numberValue(order.expectedProfit), status: order.status || 'draft', is_published: Boolean(order.isPublished), is_manual_total: Boolean(order.isManualTotal), is_demo: Boolean(order.isDemo) };
  const saveQuery = isNew
    ? client.from('orders').insert(payload, { defaultToNull: false })
    : client.from('orders').update(payload).eq('id', id);
  const { data: saved, error } = await saveQuery.select().single();
  if (error) throw new Error(`Database ${isNew ? 'insert' : 'update'} error (orders): ${errorMessage(error)}`);
  const oldPhotos = current?.photos || []; let photos = [];
  try {
    photos = await uploadOrderPhotos(id, order.photos || []);
    const { error: photoError } = await client.from('orders').update({ photos }).eq('id', id);
    if (photoError) throw new Error(`Фотографии загружены, но их пути не сохранены в заказе: ${errorMessage(photoError)}`);
    const { error: deleteError } = await client.from('order_works').delete().eq('order_id', id);
    if (deleteError) throw new Error(`Не удалось обновить работы заказа: ${errorMessage(deleteError)}`);
    const works = (order.selectedWorks || []).map((work, index) => ({ order_id: id, work_id: work.workId || null, category_id: work.categoryId || null, group_id: work.groupId || null, title: work.title, unit: work.unit || '', unit_price: numberValue(work.unitPrice), quantity: numberValue(work.quantity), total_price: numberValue(work.totalPrice), sort_order: index }));
    if (works.length) { const { error: worksError } = await client.from('order_works').insert(works); if (worksError) throw new Error(`Не удалось сохранить работы заказа: ${errorMessage(worksError)}`); }
    await removeFiles(STORAGE_BUCKETS.orders, oldPhotos.filter((path) => !photos.includes(path)));
    return camelOrder({ ...saved, photos, order_works: works });
  } catch (saveError) {
    await removeFiles(STORAGE_BUCKETS.orders, photos.filter((path) => !oldPhotos.includes(path))).catch(() => {});
    if (isNew) await client.from('orders').delete().eq('id', id);
    else await client.from('orders').update({ photos: oldPhotos }).eq('id', id);
    throw saveError;
  }
}

export async function deleteOrder(id) { const client = requireSupabase(); const { data } = await client.from('orders').select('photos').eq('id', id).maybeSingle(); const { error } = await client.from('orders').delete().eq('id', id); if (error) throw error; await removeFiles(STORAGE_BUCKETS.orders, data?.photos || []); }
export async function setOrderPublished(id, isPublished) { const { data, error } = await requireSupabase().from('orders').update({ is_published: isPublished, status: isPublished ? 'active' : 'draft' }).eq('id', id).select().single(); if (error) throw error; return camelOrder(data); }
export async function setOrderStatus(id, status) { const updates = { status }; if (status !== 'active') updates.is_published = false; const { data, error } = await requireSupabase().from('orders').update(updates).eq('id', id).select().single(); if (error) throw error; return camelOrder(data); }
export const createDemoOrders = getOrders;
export async function deleteDemoOrders() { const { error } = await requireSupabase().from('orders').delete().eq('is_demo', true); if (error) throw error; return getOrders(); }

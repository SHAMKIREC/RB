const KEY = 'rb_reviews_mvp';
const DEMO_IDS = new Set(['demo-review-1', 'demo-review-2', 'demo-review-3']);
const read = () => { try { const reviews = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(reviews) ? reviews : []; } catch { return []; } };
const write = (reviews) => localStorage.setItem(KEY, JSON.stringify(reviews));
const normalizePhotos = (photos) => (Array.isArray(photos) ? photos : [])
  .map((photo, index) => {
    const src = typeof photo === 'string' ? photo : photo?.src;
    return src ? { src, name: photo?.name || `photo-${index + 1}` } : null;
  })
  .filter(Boolean);

export const getReviews = () => read().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
export const getPublishedReviews = () => getReviews().filter((review) => review.isPublished && review.status === 'published');
export const saveReview = (review) => { const reviews = read(); const now = new Date().toISOString(); const next = { ...review, rating: Math.min(5, Math.max(1, Number(review.rating) || 5)), photos: normalizePhotos(review.photos), id: review.id || crypto.randomUUID(), createdAt: review.createdAt || now, updatedAt: now }; const index = reviews.findIndex((item) => item.id === next.id); if (index < 0) reviews.push(next); else reviews[index] = next; write(reviews); return next; };
export const deleteReview = (id) => write(read().filter((review) => review.id !== id));
export const setReviewStatus = (id, status) => { const review = getReviews().find((item) => item.id === id); return review ? saveReview({ ...review, status, isPublished: status === 'published' }) : null; };
export const createDemoReviews = () => { if (read().some((review) => DEMO_IDS.has(review.id))) return getReviews(); const now = new Date().toISOString(); const demos = [
  { id: 'demo-review-1', clientName: 'Александр', location: 'Люберцы, ул. Кирова', serviceTitle: 'Ремонт кухни', reviewText: 'Работы выполнили аккуратно, сроки соблюдены. Смета была понятной на каждом этапе.', rating: 5, photos: [], orderNumber: '', contact: '', status: 'published', isPublished: true, isDemo: true, createdAt: now, updatedAt: now },
  { id: 'demo-review-2', clientName: 'Марина', location: 'Москва, Некрасовка', serviceTitle: 'Ремонт ванной комнаты', reviewText: 'Спасибо за внимательное отношение к деталям и аккуратную укладку плитки.', rating: 5, photos: [], orderNumber: '1002', contact: '', status: 'published', isPublished: true, isDemo: true, createdAt: now, updatedAt: now },
  { id: 'demo-review-3', clientName: 'Игорь', location: 'Московская область', serviceTitle: 'Установка навеса', reviewText: 'Навес получился прочным и аккуратным. Все договорённости были выполнены.', rating: 5, photos: [], orderNumber: '', contact: '', status: 'published', isDemo: true, isPublished: true, createdAt: now, updatedAt: now },
]; write([...read(), ...demos]); return getReviews(); };
export const deleteDemoReviews = () => write(read().filter((review) => !DEMO_IDS.has(review.id)));

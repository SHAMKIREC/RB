const SITE_URL = 'https://www.rb-24.ru';
const IMAGE_URL = `${SITE_URL}/og/rb-preview-1200x630.jpg`;

const pages = {
  '/services': ['Услуги РБ — ремонт и строительство', 'Полы, стены, плитка, электрика, сантехника, демонтаж и ремонт под ключ.'],
  '/calculator': ['Калькулятор ремонта — РБ', 'Посчитайте предварительную стоимость ремонтных и строительных работ онлайн.'],
  '/orders': ['Заказы на ремонтные работы — РБ', 'Актуальные заказы: состав работ, сроки и условия для исполнителей.'],
  '/projects': ['Проекты РБ — фото выполненных работ', 'Реальные объекты, выполненные работы, сроки и результаты.'],
  '/reviews': ['Отзывы клиентов — РБ', 'Отзывы о ремонте, отделке и строительных работах в Саратове.'],
  '/documentation': ['Строительная документация — РБ', 'ППР, ПОС, ПОР, КМД, технологические карты и сметы по исходным данным.'],
  '/about': ['О компании РБ Решаем Быстро', 'Ремонт, отделка и строительные работы в Саратове. Как работаем и как связаться.'],
  '/nrv-digital': ['NRV DIGITAL — цифровой партнёр РБ', 'Сайты, веб-приложения, калькуляторы, автоматизация и техническая поддержка.'],
  '/privacy': ['Политика обработки данных — РБ', 'Информация об обработке персональных данных и правах пользователей сайта.'],
};

const serviceNames = {
  'remont-polov': 'Полы',
  'remont-sten': 'Стены',
  'ukladka-plitki': 'Плитка',
  elektrika: 'Электрика',
  santehnika: 'Сантехника',
  'ustanovka-dverey': 'Установка дверей',
  demontazh: 'Демонтаж',
  gipsokarton: 'Гипсокартон',
  'remont-potolkov': 'Потолки',
  'remont-balkonov': 'Балконы и лоджии',
  'remont-pod-klyuch': 'Ремонт под ключ',
  metallokonstrukcii: 'Металлоконструкции',
  zabory: 'Заборы',
  navesy: 'Навесы',
  lestnicy: 'Лестницы',
  besedki: 'Беседки',
  bani: 'Бани',
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const normalizePath = (raw = '') => {
  const path = `/${String(raw).replace(/^\/+/, '').split('?')[0]}`;
  return path === '//' ? '/' : path.replace(/\/$/, '') || '/';
};

const getPreview = (path) => {
  if (pages[path]) return pages[path];

  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const name = serviceNames[serviceMatch[1]];
    if (name) return [`${name} в Саратове — РБ`, `Услуги по направлению «${name}» в Саратове. Посмотрите работы и рассчитайте стоимость.`];
  }

  if (/^\/projects\/[^/]+$/.test(path)) {
    return ['Проект РБ — выполненные работы', 'Фото объекта, выполненные работы и результат проекта в Саратове.'];
  }

  if (/^\/orders\/[^/]+$/.test(path)) {
    return ['Заказ на ремонтные работы — РБ', 'Состав работ, сроки и условия заказа в Саратове.'];
  }

  return ['РБ — ремонт и строительство в Саратове', 'Квартиры и дома: отделка, электрика, сантехника и ремонт под ключ. Онлайн-расчёт стоимости.'];
};

export default function handler(req, res) {
  const path = normalizePath(req.query.path || '/');
  const [title, description] = getPreview(path);
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:image" content="${IMAGE_URL}"><meta property="og:image:secure_url" content="${IMAGE_URL}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="РБ — ремонт и строительные услуги в Саратове"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:type" content="website"><meta property="og:site_name" content="РБ Решаем Быстро"><meta property="og:locale" content="ru_RU"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${IMAGE_URL}"><meta http-equiv="refresh" content="0;url=${escapeHtml(canonical)}"></head><body><a href="${escapeHtml(canonical)}">Открыть страницу</a></body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}

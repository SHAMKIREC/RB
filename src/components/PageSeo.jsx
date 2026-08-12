import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_IMAGE = '/assets/hero-image.png';

const pages = {
  '/': {
    title: 'Ремонт квартир в Саратове под ключ | РБ Решаем Быстро',
    description: 'Ремонт квартир, отделочные и строительные работы в Саратове. Компания РБ выполняет ремонт под ключ, электрику, сантехнику, отделку и строительные работы.',
  },
  '/calculator': {
    title: 'Калькулятор ремонта в Саратове | РБ Решаем Быстро',
    description: 'Рассчитайте предварительную стоимость ремонта, отделочных и строительных работ в Саратове.',
  },
  '/orders': {
    title: 'Активные заказы на строительные работы в Саратове | РБ',
    description: 'Актуальные заказы на ремонтные, отделочные и строительные работы в Саратове.',
  },
  '/projects': {
    title: 'Проекты ремонта и строительства в Саратове | РБ',
    description: 'Примеры выполненных строительных и ремонтных работ компании РБ в Саратове.',
  },
  '/reviews': {
    title: 'Отзывы о ремонте в Саратове | РБ Решаем Быстро',
    description: 'Отзывы клиентов о ремонте квартир, строительных и отделочных работах компании РБ.',
  },
  '/reviews/new': {
    title: 'Оставить отзыв | РБ Решаем Быстро',
    description: 'Оставьте отзыв о выполненных ремонтных, строительных или отделочных работах компании РБ.',
  },
  '/documentation': {
    title: 'ППР, ПОС, ПОР, КМД в Саратове | Строительная документация РБ',
    description: 'Разработка строительной документации в Саратове: ППР, ПОС, ПОР, КМД, технологические карты и сметы.',
  },
  '/about': {
    title: 'О компании РБ Решаем Быстро | Строительные услуги в Саратове',
    description: 'Информация о компании РБ Решаем Быстро и строительных услугах в Саратове.',
  },
  '/nrv-digital': {
    title: 'NRV DIGITAL | Сайты и веб-приложения',
    description: 'Разработка сайтов, каталогов, калькуляторов и веб-приложений NRV DIGITAL.',
  },
};

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector.match(/="([^"]+)"/)?.[1] || '');
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

export default function PageSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/services' || pathname.startsWith('/category/')) return;

    const isAdmin = pathname.startsWith('/admin/');
    const isOrder = pathname.startsWith('/orders/');
    const isProject = pathname.startsWith('/projects/');
    const isKnownPage = Boolean(pages[pathname] || isOrder || isProject);
    const config = pages[pathname]
      || (isOrder ? { title: 'Заказ на строительные работы | РБ', description: 'Информация об активном заказе на строительные и ремонтные работы.' } : null)
      || (isProject ? { title: 'Проект ремонта и строительства | РБ', description: 'Информация о выполненном строительном или ремонтном проекте компании РБ.' } : null)
      || { title: 'Страница не найдена | РБ Решаем Быстро', description: 'Запрашиваемая страница не найдена.' };
    const title = isAdmin ? 'Администрирование | РБ' : config.title;
    const description = isAdmin ? 'Панель администрирования сайта РБ.' : config.description;
    const image = new URL(DEFAULT_IMAGE, window.location.origin).href;

    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.getElementById('service-schema')?.remove();
    document.title = title;
    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[name="robots"]', 'name', isAdmin || !isKnownPage ? 'noindex, nofollow' : 'index, follow');
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:type"]', 'property', 'website');
    setMeta('meta[property="og:image"]', 'property', image);
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', image);
  }, [pathname]);

  return null;
}

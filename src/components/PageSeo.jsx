import { useLocation } from 'react-router-dom';
import SeoHead from './SeoHead';
import { breadcrumbSchema, MAIN_SITE_SCHEMAS } from '../lib/seo';

const pages = {
  '/': {
    title: 'Ремонт и строительные услуги в Саратове | РБ Решаем Быстро',
    description: 'Ремонт квартир и строительные работы в Саратове. Полы, стены, плитка, электрика, сантехника, ремонт под ключ. Расчёт стоимости онлайн.',
    socialDescription: 'Ремонт квартир, отделка, электрика, сантехника и строительные работы в Саратове.',
    schemas: MAIN_SITE_SCHEMAS,
  },
  '/calculator': {
    title: 'Калькулятор ремонта в Саратове — расчёт стоимости | РБ',
    description: 'Рассчитайте предварительную стоимость ремонта, отделочных и строительных работ в Саратове с помощью онлайн-калькулятора РБ.',
    label: 'Калькулятор ремонта',
  },
  '/orders': {
    title: 'Заказы на ремонтные работы в Саратове | РБ',
    description: 'Опубликованные заказы на ремонтные, отделочные и строительные работы в Саратове: состав работ, сроки и оплата исполнителю.',
    label: 'Активные заказы',
  },
  '/projects': {
    title: 'Проекты ремонта и строительства в Саратове | РБ',
    description: 'Завершённые проекты РБ в Саратове: фотографии объектов, выполненные ремонтные и строительные работы, сроки и итоговые сметы.',
    label: 'Проекты',
  },
  '/reviews': {
    title: 'Отзывы клиентов о ремонте и строительстве | РБ Саратов',
    description: 'Отзывы клиентов о ремонтных, отделочных и строительных работах компании РБ Решаем Быстро в Саратове.',
    label: 'Отзывы',
  },
  '/documentation': {
    title: 'ППР, ПОС, ПОР, КМД и сметы | Строительная документация',
    description: 'Разработка ППР, ПОС, ПОР, КМД, технологических карт и смет для строительных работ. Подготовка документации по исходным данным.',
    label: 'Строительная документация',
  },
  '/about': {
    title: 'О компании РБ Решаем Быстро | Ремонт в Саратове',
    description: 'О компании РБ Решаем Быстро: ремонт квартир, отделочные и строительные работы в Саратове, порядок работы и способы связи.',
    label: 'О нас',
  },
  '/nrv-digital': {
    title: 'NRV DIGITAL — цифровой партнёр РБ Решаем Быстро',
    description: 'NRV DIGITAL — цифровой партнёр РБ Решаем Быстро по разработке сайтов, веб-приложений, калькуляторов, автоматизации и технической поддержке.',
    label: 'Партнёр NRV DIGITAL',
  },
  '/privacy': {
    title: 'Политика обработки персональных данных | РБ Решаем Быстро',
    description: 'Политика обработки персональных данных сайта РБ Решаем Быстро: цели обработки, состав данных, права пользователей и порядок обращений.',
    label: 'Политика обработки персональных данных',
  },
};

export default function PageSeo() {
  const { pathname } = useLocation();

  if (pathname === '/services' || pathname.startsWith('/category/')) return null;
  if (/^\/(projects|orders)\/[^/]+$/.test(pathname)) return null;

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isAdmin) {
    return <SeoHead title="Администрирование | РБ" description="Служебный раздел сайта." noIndex noFollow socialPreview={false} />;
  }

  const config = pages[pathname];
  if (!config) {
    return <SeoHead title="Страница не найдена | РБ Решаем Быстро" description="Запрашиваемая страница не найдена." noIndex noFollow socialPreview={false} />;
  }

  const schemas = config.schemas || (config.label ? [breadcrumbSchema([
    { name: 'Главная', path: '/' },
    { name: config.label, path: pathname },
  ])] : []);

  return <SeoHead {...config} canonicalPath={pathname} schemas={schemas} />;
}

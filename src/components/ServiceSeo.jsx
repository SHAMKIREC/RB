import SeoHead from './SeoHead';
import { absoluteUrl, breadcrumbSchema } from '../lib/seo';

export default function ServiceSeo({ category }) {
  const isCategory = Boolean(category);
  const canonicalPath = isCategory ? `/services?category=${encodeURIComponent(category.id)}` : '/services';
  const title = isCategory ? category.seo.title : 'Строительные и ремонтные услуги в Саратове | РБ';
  const description = isCategory
    ? category.seo.metaDescription
    : 'Каталог строительных и ремонтных услуг РБ в Саратове: полы, стены, плитка, электрика, сантехника, демонтаж и ремонт под ключ.';
  const breadcrumbs = [
    { name: 'Главная', path: '/' },
    { name: 'Услуги', path: '/services' },
    ...(isCategory ? [{ name: category.name, path: canonicalPath }] : []),
  ];
  const schemas = /** @type {Record<string, unknown>[]} */ ([breadcrumbSchema(breadcrumbs)]);

  if (isCategory) {
    schemas.unshift({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: category.name,
      description,
      serviceType: category.name,
      areaServed: { '@type': 'City', name: 'Саратов' },
      provider: { '@id': 'https://www.rb-24.ru/#business', name: 'РБ Решаем Быстро' },
      url: absoluteUrl(canonicalPath),
      image: absoluteUrl(category.image),
    });
  }

  return <SeoHead title={title} description={description} canonicalPath={canonicalPath} image={category?.image} imageAlt={category?.imageAlt} schemas={schemas} />;
}

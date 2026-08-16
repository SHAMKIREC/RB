export const SITE_URL = 'https://www.rb-24.ru';
export const SITE_NAME = 'РБ Решаем Быстро';
export const DEFAULT_OG_IMAGE = '/og/rb-preview-1200x630.jpg';

export const absoluteUrl = (value = '/') => {
  try {
    return new URL(value, SITE_URL).href;
  } catch {
    return SITE_URL;
  }
};

export const compactDescription = (value, fallback, maxLength = 160) => {
  const normalized = String(value || fallback || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const MAIN_SITE_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'HomeAndConstructionBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: 'РБ',
    url: `${SITE_URL}/`,
    telephone: '+79063052828',
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    logo: absoluteUrl('/favicon.svg'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Саратов',
      addressCountry: 'RU',
    },
    areaServed: {
      '@type': 'City',
      name: 'Саратов',
    },
    sameAs: [
      'https://vk.ru/club237262784',
      'https://t.me/+79063052828',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${SITE_URL}/#business` },
  },
];

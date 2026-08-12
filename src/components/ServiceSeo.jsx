import { useEffect } from 'react';

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector.match(/="([^"]+)"/)?.[1] || '');
    document.head.appendChild(element);
  }
  element.content = value;
};

export default function ServiceSeo({ category }) {
  useEffect(() => {
    const isCategory = Boolean(category);
    const title = isCategory ? category.seo.title : 'Строительные услуги в Саратове | Ремонт и отделка РБ';
    const description = isCategory
      ? category.seo.metaDescription
      : 'Все строительные услуги компании РБ в Саратове: ремонт квартир, отделочные работы, электрика, сантехника, плитка и ремонт под ключ.';
    const canonicalUrl = new URL('/services', window.location.origin);
    const image = isCategory
      ? new URL(category.image, window.location.origin).href
      : new URL('/assets/hero-image.png', window.location.origin).href;

    if (isCategory) canonicalUrl.searchParams.set('category', category.id);

    document.title = title;
    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[name="robots"]', 'name', 'index, follow');
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:type"]', 'property', 'website');
    setMeta('meta[property="og:image"]', 'property', image);
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', image);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl.href;

    const schemaId = 'service-schema';
    document.getElementById(schemaId)?.remove();
    if (!isCategory) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: category.name,
      description,
      areaServed: 'Саратов',
      provider: { '@type': 'Organization', name: 'РБ' },
      url: canonicalUrl.href,
      image,
    };
    const script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }, [category]);

  return null;
}

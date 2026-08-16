import { useEffect } from 'react';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo';

const upsertMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!value) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector.match(/="([^"]+)"/)?.[1] || '');
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

export default function SeoHead({
  title,
  description,
  socialDescription = description,
  canonicalPath = '',
  image = DEFAULT_OG_IMAGE,
  imageAlt = '',
  type = 'website',
  noIndex = false,
  noFollow = false,
  schemas = [],
  socialPreview = true,
}) {
  const schemasJson = JSON.stringify(schemas.filter(Boolean));

  useEffect(() => {
    const canonicalUrl = canonicalPath ? absoluteUrl(canonicalPath) : '';
    const imageUrl = image ? absoluteUrl(image) : '';

    document.title = title;
    upsertMeta('meta[name="description"]', 'name', description);
    upsertMeta('meta[name="robots"]', 'name', `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`);

    let canonical = /** @type {HTMLLinkElement | null} */ (document.head.querySelector('link[rel="canonical"]'));
    if (!canonicalUrl) {
      canonical?.remove();
    } else {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    const social = socialPreview ? {
      'meta[property="og:title"]': ['property', title],
      'meta[property="og:description"]': ['property', socialDescription],
      'meta[property="og:image"]': ['property', imageUrl],
      'meta[property="og:image:alt"]': ['property', imageAlt || title],
      'meta[property="og:url"]': ['property', canonicalUrl],
      'meta[property="og:type"]': ['property', type],
      'meta[property="og:site_name"]': ['property', SITE_NAME],
      'meta[property="og:locale"]': ['property', 'ru_RU'],
      'meta[name="twitter:card"]': ['name', 'summary_large_image'],
      'meta[name="twitter:title"]': ['name', title],
      'meta[name="twitter:description"]': ['name', socialDescription],
      'meta[name="twitter:image"]': ['name', imageUrl],
      'meta[name="twitter:image:alt"]': ['name', imageAlt || title],
    } : {};

    const socialSelectors = [
      'meta[property="og:title"]', 'meta[property="og:description"]',
      'meta[property="og:image"]', 'meta[property="og:image:alt"]',
      'meta[property="og:url"]', 'meta[property="og:type"]',
      'meta[property="og:site_name"]', 'meta[property="og:locale"]',
      'meta[name="twitter:card"]', 'meta[name="twitter:title"]',
      'meta[name="twitter:description"]', 'meta[name="twitter:image"]',
      'meta[name="twitter:image:alt"]',
    ];
    socialSelectors.forEach((selector) => {
      const config = social[selector];
      if (config) upsertMeta(selector, config[0], config[1]);
      else document.head.querySelector(selector)?.remove();
    });

    document.head.querySelectorAll('script[data-rb-seo-schema]').forEach((node) => node.remove());
    JSON.parse(schemasJson).forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.rbSeoSchema = String(index);
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [canonicalPath, description, image, imageAlt, noFollow, noIndex, schemasJson, socialDescription, socialPreview, title, type]);

  return null;
}

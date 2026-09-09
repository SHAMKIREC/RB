export const SERVICE_SEO_SLUGS = {
  floors: 'remont-polov',
  walls: 'remont-sten',
  tiles: 'ukladka-plitki',
  electric: 'elektrika',
  plumbing: 'santehnika',
  doors: 'ustanovka-dverey',
  demolition: 'demontazh',
  drywall: 'gipsokarton',
  ceilings: 'remont-potolkov',
  balcony: 'remont-balkonov',
  turnkey: 'remont-pod-klyuch',
  metal: 'metallokonstrukcii',
  fences: 'zabory',
  canopies: 'navesy',
  stairs: 'lestnicy',
  gazebos: 'besedki',
  bathhouses: 'bani',
};

export const SERVICE_ID_BY_SEO_SLUG = Object.fromEntries(
  Object.entries(SERVICE_SEO_SLUGS).map(([id, slug]) => [slug, id]),
);

export const getServiceSeoPath = (categoryId) => {
  const slug = SERVICE_SEO_SLUGS[categoryId];
  return slug ? `/services/${slug}` : '/services';
};

export const getServiceIdFromSeoSlug = (slug) => SERVICE_ID_BY_SEO_SLUG[slug] || null;

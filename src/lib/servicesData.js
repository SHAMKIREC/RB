export const PHONE_NUMBER = "tel:+79063052828";
export const PHONE_DISPLAY = "+7 906 305-28-28";
export const VK_URL = "https://vk.com/rb_remont";
export const CITY = "Саратов";
export const MIN_ORDER = 5000;

export const SERVICE_CATEGORIES = [
  {
    id: "floors",
    name: "Полы",
    slug: "floors",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80",
    priceFrom: "от 350 ₽/м²",
    description: "Стяжка, наливной пол, ламинат, кварцвинил, линолеум и плинтуса. Любые виды напольных покрытий с гарантией качества.",
  },
  {
    id: "walls",
    name: "Стены",
    slug: "walls",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
    priceFrom: "от 80 ₽/м²",
    description: "Штукатурка, шпаклёвка, покраска, обои. Идеально ровные стены для вашего интерьера.",
  },
  {
    id: "tiles",
    name: "Плитка",
    slug: "tiles",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    priceFrom: "от 1600 ₽/м²",
    description: "Укладка плитки на стены и пол, керамогранит, мозаика, затирка. Точность до миллиметра.",
  },
  {
    id: "electric",
    name: "Электрика",
    slug: "electric",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    priceFrom: "от 120 ₽/п.м",
    description: "Розетки, выключатели, штробление, прокладка кабеля, установка люстр. Безопасно и по стандартам.",
  },
  {
    id: "plumbing",
    name: "Сантехника",
    slug: "plumbing",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    priceFrom: "от 500 ₽/п.м",
    description: "Установка унитазов, раковин, ванн, душевых кабин, смесителей и разводка труб.",
  },
  {
    id: "doors",
    name: "Двери",
    slug: "doors",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    priceFrom: "от 3800 ₽/шт",
    description: "Установка межкомнатных, двойных и скрытых дверей с доборами. Аккуратно и надёжно.",
  },
  {
    id: "demolition",
    name: "Демонтаж",
    slug: "demolition",
    image: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800&q=80",
    priceFrom: "от 100 ₽/м²",
    description: "Демонтаж обоев, плитки, штукатурки, стяжки, перегородок и дверных блоков. Быстро и чисто.",
  },
  {
    id: "drywall",
    name: "Гипсокартон",
    slug: "drywall",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80",
    priceFrom: "от 900 ₽/м²",
    description: "Перегородки, обшивка стен, одноуровневые и многоуровневые потолки из гипсокартона.",
  },
  {
    id: "ceilings",
    name: "Потолки",
    slug: "ceilings",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    priceFrom: "от 450 ₽/м²",
    description: "Натяжные потолки, многоуровневые конструкции, покраска и декоративная отделка.",
  },
  {
    id: "balcony",
    name: "Балконы и лоджии",
    slug: "balcony",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    priceFrom: "от 25 000 ₽",
    description: "Остекление, утепление, обшивка, пол и потолок на балконе под ключ.",
  },
  {
    id: "turnkey",
    name: "Ремонт под ключ",
    slug: "turnkey",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    priceFrom: "от 4 000 ₽/м²",
    description: "Полный ремонт квартиры от демонтажа до финишной отделки с гарантией 3 года.",
  },
  {
    id: "metal",
    name: "Металлоконструкции",
    slug: "metal",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    priceFrom: "от 1 500 ₽/п.м",
    description: "Заборы, ворота, навесы, лестницы, козырьки, беседки. Сварка и монтаж.",
  },
];

export const TURNKEY_OPTIONS = [
  { id: "cosmetic", name: "Косметический", price: 4000, unit: "м²" },
  { id: "capital", name: "Капитальный", price: 7000, unit: "м²" },
  { id: "designer", name: "Дизайнерский", price: 12000, unit: "м²" },
];

export const PRICE_LIST = {
  demolition: {
    name: "Демонтажные работы",
    items: [
      { name: "Демонтаж обоев", price: 100, unit: "м²" },
      { name: "Демонтаж плитки", price: 350, unit: "м²" },
      { name: "Демонтаж штукатурки", price: 300, unit: "м²" },
      { name: "Демонтаж стяжки", price: 550, unit: "м²" },
      { name: "Демонтаж перегородки (кирпич)", price: 900, unit: "м²" },
      { name: "Демонтаж дверного блока", price: 600, unit: "шт" },
    ],
  },
  plaster: {
    name: "Штукатурные работы",
    items: [
      { name: "Штукатурка стен по маякам", price: 700, unit: "м²" },
      { name: "Штукатурка стен без маяков", price: 550, unit: "м²" },
      { name: "Штукатурка потолка", price: 800, unit: "м²" },
      { name: "Штукатурка откосов", price: 500, unit: "п.м" },
    ],
  },
  putty: {
    name: "Шпаклёвочные работы",
    items: [
      { name: "Шпаклёвка стен под обои", price: 300, unit: "м²" },
      { name: "Шпаклёвка стен под покраску", price: 450, unit: "м²" },
      { name: "Шпаклёвка потолка", price: 400, unit: "м²" },
      { name: "Шлифовка стен", price: 120, unit: "м²" },
      { name: "Грунтовка", price: 80, unit: "м²" },
    ],
  },
  painting: {
    name: "Малярные работы",
    items: [
      { name: "Покраска стен", price: 300, unit: "м²" },
      { name: "Покраска потолка", price: 350, unit: "м²" },
      { name: "Поклейка флизелиновых обоев", price: 400, unit: "м²" },
      { name: "Поклейка виниловых обоев", price: 450, unit: "м²" },
      { name: "Поклейка фотообоев", price: 600, unit: "м²" },
    ],
  },
  tiles: {
    name: "Плиточные работы",
    items: [
      { name: "Укладка плитки (стены)", price: 1800, unit: "м²" },
      { name: "Укладка плитки (пол)", price: 1600, unit: "м²" },
      { name: "Керамогранит", price: 2000, unit: "м²" },
      { name: "Мозаика", price: 3000, unit: "м²" },
      { name: "Затирка швов", price: 200, unit: "м²" },
    ],
  },
  floors: {
    name: "Полы",
    items: [
      { name: "Стяжка пола", price: 700, unit: "м²" },
      { name: "Полусухая стяжка", price: 800, unit: "м²" },
      { name: "Наливной пол", price: 450, unit: "м²" },
      { name: "Укладка ламината", price: 500, unit: "м²" },
      { name: "Укладка кварцвинила", price: 650, unit: "м²" },
      { name: "Укладка линолеума", price: 350, unit: "м²" },
      { name: "Монтаж плинтуса", price: 200, unit: "п.м" },
    ],
  },
  drywall: {
    name: "Гипсокартон",
    items: [
      { name: "Перегородки ГКЛ", price: 1200, unit: "м²" },
      { name: "Обшивка стен ГКЛ", price: 900, unit: "м²" },
      { name: "Потолок ГКЛ", price: 1800, unit: "м²" },
      { name: "Многоуровневый потолок", price: 2500, unit: "м²" },
    ],
  },
  electric: {
    name: "Электромонтаж",
    items: [
      { name: "Монтаж розетки", price: 400, unit: "шт" },
      { name: "Монтаж выключателя", price: 400, unit: "шт" },
      { name: "Установка подрозетника", price: 250, unit: "шт" },
      { name: "Штробление стен", price: 350, unit: "п.м" },
      { name: "Прокладка кабеля", price: 120, unit: "п.м" },
      { name: "Установка люстры", price: 800, unit: "шт" },
    ],
  },
  plumbing: {
    name: "Сантехника",
    items: [
      { name: "Установка унитаза", price: 3000, unit: "шт" },
      { name: "Установка раковины", price: 2000, unit: "шт" },
      { name: "Установка смесителя", price: 1200, unit: "шт" },
      { name: "Установка ванны", price: 4000, unit: "шт" },
      { name: "Установка душевой кабины", price: 5000, unit: "шт" },
      { name: "Разводка труб", price: 500, unit: "п.м" },
    ],
  },
  doors: {
    name: "Двери",
    items: [
      { name: "Установка межкомнатной двери", price: 3800, unit: "шт" },
      { name: "Установка двери с доборами", price: 4500, unit: "шт" },
      { name: "Установка двойной двери", price: 6000, unit: "шт" },
      { name: "Установка скрытой двери", price: 6500, unit: "шт" },
    ],
  },
};

export const CATEGORY_PRICE_MAP = {
  floors: ["floors"],
  walls: ["plaster", "putty", "painting"],
  tiles: ["tiles"],
  electric: ["electric"],
  plumbing: ["plumbing"],
  doors: ["doors"],
  demolition: ["demolition"],
  drywall: ["drywall"],
};
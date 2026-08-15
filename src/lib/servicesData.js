import floorImage from '../assets/images/services/01_poly.webp';
import catalogFloorImage from '../assets/images/services/pol_ukladka_laminata.webp';
import floorCoveringsImage from '../assets/images/services/poly_napolnye_pokrytiya.webp';
import floorPreparationImage from '../assets/images/services/poly_podgotovka_osnovaniya.webp';
import tileImage from '../assets/images/services/03_plitka.webp';
import demolitionImage from '../assets/images/services/07_demontazh.webp';
import demolitionWallsImage from '../assets/images/services/demontazh_sten_generated.webp';
import demolitionFloorImage from '../assets/images/services/demontazh_pola.webp';
import demolitionFinishingImage from '../assets/images/services/demontazh_otdelki_generated.webp';
import wallImage from '../assets/images/services/steny_pokraska.webp';
import wallPreparationImage from '../assets/images/services/steny_podgotovka.webp';
import wallFinishingImage from '../assets/images/services/steny_finishnaya_otdelka.webp';
import electricianImage from '../assets/images/services/elektrik_shit.webp';
import plumberImage from '../assets/images/services/santehnik_remont_trub.webp';
import plumbingInstallationImage from '../assets/images/services/santehnika_ustanovka.webp';
import plumbingPipesRepairImage from '../assets/images/services/santehnika_truby_remont.webp';
import doorImage from '../assets/images/services/dveri.webp';
import drywallImage from '../assets/images/services/montazh_gipsokartona.webp';
import ceilingImage from '../assets/images/services/remont_potolka.webp';
import balconyImage from '../assets/images/services/uteplenie_balkona.webp';
import turnkeyImage from '../assets/images/services/remont_kvartiry.webp';
import metalImage from '../assets/images/services/svarka_metallokonstrukciy.webp';
import fencesImage from '../assets/images/services/13_zabory_i_ograzhdeniya.webp';
import canopiesImage from '../assets/images/services/14_navesy_i_kozyrki.webp';
import stairsImage from '../assets/images/services/15_lestnitsy.webp';
import gazebosImage from '../assets/images/services/16_stroitelstvo_besedok.webp';
import bathhousesImage from '../assets/images/services/17_stroitelstvo_ban.webp';

export const PHONE_NUMBER = 'tel:+79063052828';
export const PHONE_DISPLAY = '+7 906 305-28-28';
export const VK_URL = 'https://vk.ru/club237262784';
export const CITY = 'Саратов';
export const MIN_ORDER = 5000;

/** @typedef {[string, number, string]} CatalogItem */
/** @typedef {[string, string, string, CatalogItem[]]} CatalogSection */
/** @typedef {[string, string, string, string, string, CatalogSection[]]} CatalogCategory */
/** @type {CatalogCategory[]} */
const catalog = [
  ['floors','Полы','/assets/catalog-floors.png','от 450 ₽/м²','Укладка и ремонт напольных покрытий в квартирах и домах. Подбираем технологию под основание, покрытие и нагрузку.',[
    ['floors_finish','Напольные покрытия','https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80',[['Укладка ламината',600,'м²'],['Укладка кварцвинила',800,'м²'],['Укладка линолеума',450,'м²'],['Укладка паркета',1200,'м²']]],
    ['floors_base','Подготовка пола','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',[['Стяжка пола',900,'м²'],['Выравнивание пола',500,'м²'],['Монтаж плинтусов',250,'п.м']]]]],
  ['walls','Стены','https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80','от 300 ₽/м²','Подготавливаем стены под обои, покраску и декоративную отделку. Работаем с квартирами, домами и коммерческими помещениями.',[
    ['walls_prep','Подготовка стен','https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',[['Штукатурка стен',700,'м²'],['Шпаклевка стен',350,'м²'],['Грунтовка стен',100,'м²']]],
    ['walls_finish','Финишная отделка','https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80',[['Поклейка обоев',450,'м²'],['Покраска стен',350,'м²'],['Декоративная штукатурка',1200,'м²']]]]],
  ['tiles','Плитка','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','от 1 600 ₽/м²','Укладываем плитку и керамогранит в ванных, кухнях и жилых помещениях. Соблюдаем геометрию, раскладку и аккуратность швов.',[
    ['tiles_work','Плиточные работы','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',[['Укладка плитки на стены',1800,'м²'],['Укладка плитки на пол',1600,'м²'],['Ванная комната плиткой',1800,'м²'],['Фартук кухни',2500,'м²'],['Затирка швов',250,'м²'],['Демонтаж старой плитки',350,'м²']]]]],
  ['electric','Электрика','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80','от 400 ₽ за точку','Выполняем электромонтаж в квартирах и домах: от одной розетки до нового щита и разводки. Подбираем безопасное решение под нагрузку.',[
    ['electric_work','Электромонтаж','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',[['Монтаж розетки',400,'шт'],['Монтаж выключателя',400,'шт'],['Прокладка проводки',150,'п.м'],['Монтаж освещения',800,'шт'],['Установка автомата',600,'шт'],['Сборка электрощита',6000,'шт']]]]],
  ['plumbing','Сантехника','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80','от 1 200 ₽ за услугу','Устанавливаем и ремонтируем сантехнику, трубы и канализацию. Помогаем при срочных протечках и при комплексном ремонте санузла.',[
    ['plumbing_install','Установка сантехники','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',[['Установка смесителя',1200,'шт'],['Установка унитаза',3000,'шт'],['Установка раковины',2500,'шт'],['Монтаж полотенцесушителя',2500,'шт'],['Установка счетчика воды',1500,'шт']]],
    ['plumbing_system','Трубы и ремонт','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',[['Замена труб',700,'п.м'],['Устранение протечки',1500,'услуга'],['Разводка канализации',1400,'точка'],['Прочистка канализации',1800,'услуга']]]]],
  ['doors','Двери','https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80','от 3 500 ₽/шт','Устанавливаем и регулируем входные и межкомнатные двери. Аккуратно монтируем коробку, фурнитуру, наличники и доборы.',[
    ['doors_work','Установка и ремонт дверей','https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',[['Установка межкомнатной двери',3500,'шт'],['Установка входной двери',5000,'шт'],['Демонтаж двери',800,'шт'],['Регулировка двери',800,'шт'],['Замена фурнитуры',700,'шт']]]]],
  ['demolition','Демонтаж','https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800&q=80','от 150 ₽/м²','Безопасно демонтируем старые конструкции и отделку перед ремонтом. Учитываем материал основания и объём вывоза.',[
    ['demo_walls','Демонтаж стен','https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800&q=80',[['Перегородки',650,'м²'],['Кирпичные стены',900,'м²'],['Бетонные стены',1800,'м²']]],
    ['demo_floor','Демонтаж пола','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',[['Старая плитка',350,'м²'],['Стяжка',600,'м²'],['Ламинат',150,'м²']]],
    ['demo_finish','Демонтаж отделки','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',[['Обои',120,'м²'],['Штукатурка',300,'м²'],['Потолки',200,'м²']]]]],
  ['drywall','Гипсокартон','https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80','от 900 ₽/м²','Собираем конструкции из ГКЛ для планировки, потолков и инженерных зон. Готовим поверхность к дальнейшей отделке.',[
    ['drywall_work','Конструкции ГКЛ','https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80',[['Стены ГКЛ',900,'м²'],['Перегородки ГКЛ',1200,'м²'],['Потолки ГКЛ',1800,'м²'],['Короба ГКЛ',1300,'п.м'],['Ниши ГКЛ',2500,'шт'],['Подготовка под отделку',350,'м²']]]]],
  ['ceilings','Потолки','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80','от 600 ₽/м²','Монтируем и обновляем потолки в жилых помещениях. Подбираем решение под высоту комнаты, свет и состояние основания.',[
    ['ceilings_work','Потолочные работы','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',[['Натяжные потолки',600,'м²'],['Монтаж потолков',700,'м²'],['Ремонт потолков',500,'м²'],['Покраска потолка',350,'м²'],['Потолок ГКЛ',1800,'м²']]]]],
  ['balcony','Балконы и лоджии','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','от 30 000 ₽','Утепляем, остекляем и отделываем балконы и лоджии. Превращаем холодное пространство в аккуратную полезную зону.',[
    ['balcony_work','Ремонт балкона','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',[['Утепление балкона',500,'м²'],['Отделка вагонкой',900,'м²'],['Отделка панелями',750,'м²'],['Остекление балкона',30000,'услуга'],['Ремонт лоджии',30000,'услуга']]]]],
  ['turnkey','Ремонт под ключ','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80','от 4 500 ₽/м²','Берём ремонт квартиры на себя: от подготовки до чистовой отделки. Согласовываем состав работ и фиксируем понятную смету.',[
    ['turnkey_work','Комплексный ремонт','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',[['Косметический ремонт',4500,'м²'],['Капитальный ремонт',7000,'м²'],['Ремонт квартиры полностью',9000,'м²'],['Ремонт комнаты',4500,'м²'],['Ремонт кухни',7000,'м²']]]]],
  ['metal','Металлоконструкции','https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80','от 1 500 ₽','Изготавливаем и монтируем металлические конструкции для дома и участка. Выполняем сварку, монтаж и доработку готовых изделий.',[
    ['metal_work','Металлические работы','https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',[['Сварочные работы',1500,'услуга'],['Металлические конструкции',2500,'м²'],['Навесы',5000,'м²'],['Лестницы',12000,'услуга'],['Ограждения',1200,'п.м'],['Металлические каркасы',2500,'м²']]]]],
  ['fences','Заборы и ограждения','', 'от 60 ₽/м²', 'Установка заборов и ограждений', [
    ['fences_work','Установка заборов','',[['Сборка сварного забора',550,'п.м'],['Забор из сварной сетки',550,'п.м'],['Монтаж ограждений',500,'п.м'],['Фундамент под столбы',500,'п.м'],['Покраска забора',60,'м²']]]]],
  ['canopies','Навесы и козырьки','', 'от 5 000 ₽ / шт', 'Установка навесов', [
    ['canopies_work','Установка навесов','',[['Навес автомобильный / терраса',5000,'м²'],['Навес над крыльцом',10000,'шт'],['Козырёк над дверью',5000,'шт']]]]],
  ['stairs','Лестницы','', 'от 1 330 ₽/м²', 'Установка лестниц', [
    ['stairs_work','Установка лестниц','',[['Монтаж лестницы (услуга)',6700,'шт'],['Монтаж деревянной лестницы',12700,'шт'],['Лестница под ключ',36700,'шт'],['Установка чердачной лестницы',4670,'шт'],['Изготовление ступеней на заказ',23300,'усл'],['Отделка лестничных маршей',1330,'м²']]]]],
  ['gazebos','Строительство беседок','', 'от 670 ₽/м²', 'Строительство беседок', [
    ['gazebos_work','Строительство беседок','',[['Монтаж беседки',1750,'м²'],['Беседка под ключ',670,'м²'],['Беседка из дерева',1820,'м²']]]]],
  ['bathhouses','Строительство бань','', 'от 670 ₽/м²', 'Строительство бань', [
    ['bathhouses_work','Строительство бань','',[['Баня под ключ',5000,'м²'],['Каркасная баня',5000,'м²'],['Частичное строительство бани',1270,'м²'],['Отделка парной',670,'м²'],['Баня из бревна/газоблока',11500,'м²']]]]],
];

// One image source is shared by the home grid and the /services catalogue.
const categoryImages = {
  floors: floorImage,
  walls: wallImage,
  tiles: tileImage,
  electric: electricianImage,
  plumbing: plumberImage,
  doors: doorImage,
  demolition: demolitionImage,
  drywall: drywallImage,
  ceilings: ceilingImage,
  balcony: balconyImage,
  turnkey: turnkeyImage,
  metal: metalImage,
  fences: fencesImage,
  canopies: canopiesImage,
  stairs: stairsImage,
  gazebos: gazebosImage,
  bathhouses: bathhousesImage,
};
const subcategoryImages = {
  floors_finish: floorCoveringsImage,
  floors_base: floorPreparationImage,
  walls_prep: wallPreparationImage,
  walls_finish: wallFinishingImage,
  tiles_work: plumberImage,
  electric_work: electricianImage,
  plumbing_install: plumbingInstallationImage,
  plumbing_system: plumbingPipesRepairImage,
  doors_work: doorImage,
  demo_walls: demolitionWallsImage,
  demo_floor: demolitionFloorImage,
  demo_finish: demolitionFinishingImage,
  drywall_work: drywallImage,
  ceilings_work: ceilingImage,
  balcony_work: balconyImage,
  turnkey_work: turnkeyImage,
  metal_work: metalImage,
};
const categoryMetadata = {
  floors: { alt: 'Укладка напольных покрытий и ремонт пола в Саратове', title: 'Ремонт полов в Саратове — укладка ламината, паркета и линолеума', metaDescription: 'Укладка ламината, паркета, линолеума, стяжка и выравнивание пола в Саратове. Расчёт стоимости и выезд мастера.' },
  walls: { alt: 'Покраска, штукатурка и отделка стен в Саратове', title: 'Отделка стен в Саратове — штукатурка, шпаклёвка и покраска', metaDescription: 'Штукатурка, шпаклёвка, покраска и финишная отделка стен в Саратове. Расчёт стоимости и консультация мастера.' },
  tiles: { alt: 'Укладка плитки в ванной, кухне и жилых помещениях', title: 'Укладка плитки в Саратове — плиточные работы в ванной и на кухне', metaDescription: 'Укладка плитки и керамогранита на стены и пол в Саратове. Аккуратная раскладка, затирка швов и расчёт стоимости.' },
  electric: { alt: 'Электромонтажные работы и установка электрощита в Саратове', title: 'Электрик в Саратове — электромонтажные работы и ремонт проводки', metaDescription: 'Монтаж розеток, выключателей, освещения, проводки и электрощитов в Саратове. Быстрый выезд мастера.' },
  plumbing: { alt: 'Сантехнические работы и ремонт труб в Саратове', title: 'Сантехник в Саратове — ремонт труб и установка сантехники', metaDescription: 'Устранение протечек, замена труб, установка смесителей, унитазов и раковин в Саратове.' },
  doors: { alt: 'Установка межкомнатных и входных дверей в Саратове', title: 'Установка дверей в Саратове — монтаж и ремонт дверей', metaDescription: 'Установка и регулировка межкомнатных и входных дверей в Саратове. Монтаж коробки, фурнитуры, наличников и доборов.' },
  demolition: { alt: 'Демонтаж стен, перегородок и старой отделки в Саратове', title: 'Демонтажные работы в Саратове — стены, полы и старая отделка', metaDescription: 'Демонтаж стен, перегородок, пола, плитки и старой отделки в Саратове. Аккуратное выполнение работ перед ремонтом.' },
  drywall: { alt: 'Монтаж гипсокартона и перегородок из ГКЛ в Саратове', title: 'Монтаж гипсокартона в Саратове — перегородки и конструкции ГКЛ', metaDescription: 'Монтаж перегородок, стен, потолков и коробов из гипсокартона в Саратове. Подготовка конструкций к отделке.' },
  ceilings: { alt: 'Монтаж и ремонт потолков в Саратове', title: 'Монтаж и ремонт потолков в Саратове — натяжные и ГКЛ конструкции', metaDescription: 'Монтаж, ремонт и покраска потолков в Саратове. Натяжные потолки и конструкции из гипсокартона.' },
  balcony: { alt: 'Утепление и отделка балконов и лоджий в Саратове', title: 'Ремонт балконов и лоджий в Саратове — утепление и отделка', metaDescription: 'Утепление, остекление и отделка балконов и лоджий в Саратове. Обустройство полезного пространства под ключ.' },
  turnkey: { alt: 'Ремонт квартиры под ключ в Саратове', title: 'Ремонт квартиры под ключ в Саратове', metaDescription: 'Комплексный ремонт квартиры под ключ в Саратове: от подготовки до чистовой отделки с понятной сметой.' },
  metal: { alt: 'Изготовление и монтаж металлоконструкций в Саратове', title: 'Металлоконструкции в Саратове — изготовление, сварка и монтаж', metaDescription: 'Изготовление и монтаж металлоконструкций в Саратове: сварочные работы, каркасы, навесы, лестницы и ограждения.' },
};

Object.assign(categoryMetadata, {
  fences: { alt: 'Установка заборов и ограждений', title: 'Заборы и ограждения в Саратове', metaDescription: 'Установка заборов и ограждений: сварные конструкции, сетка, фундаменты и покраска.' },
  canopies: { alt: 'Установка навесов и козырьков', title: 'Навесы и козырьки в Саратове', metaDescription: 'Монтаж навесов для автомобиля, террасы, крыльца и козырьков над входом.' },
  stairs: { alt: 'Установка лестниц', title: 'Лестницы в Саратове', metaDescription: 'Монтаж, изготовление и отделка лестниц для дома.' },
  gazebos: { alt: 'Строительство деревянных беседок', title: 'Строительство беседок в Саратове', metaDescription: 'Монтаж и строительство беседок под ключ.' },
  bathhouses: { alt: 'Строительство бань', title: 'Строительство бань в Саратове', metaDescription: 'Строительство и отделка бань под ключ.' },
});

const formatPrice = (price, unit) => `${price.toLocaleString('ru-RU')} ₽${unit ? ` / ${unit}` : ''}`;
const HOME_HIDDEN_CATEGORY_IDS = new Set(['fences', 'canopies', 'stairs', 'gazebos', 'bathhouses']);
const parseCategoryPrice = (priceFrom) => {
  const match = String(priceFrom).match(/[\d\s]+/);
  const value = match ? Number(match[0].replace(/\s/g, '')) : 0;
  const suffix = String(priceFrom).replace(/^[^₽]*₽\s*/, '').trim();
  return { value, suffix };
};
const turnkeyPricingKey = (sectionId, index) => (
  sectionId === 'turnkey_work' && ['cosmetic', 'capital', 'turnkey'][index]
    ? { scope: 'turnkey', id: ['cosmetic', 'capital', 'turnkey'][index] }
    : null
);
const createServiceItem = (sectionId, item, index) => {
  const [name, price, unit] = item;
  const pricingKey = turnkeyPricingKey(sectionId, index);
  return {
    id: `service-${sectionId}-${index + 1}`,
    name,
    price,
    unit,
    pricingScope: pricingKey?.scope || 'serviceItems',
    pricingId: pricingKey?.id || `service-${sectionId}-${index + 1}`,
  };
};
const createCategoryPrice = (id, priceFrom) => {
  const { value, suffix } = parseCategoryPrice(priceFrom);
  const pricingKey = id === 'turnkey' ? { scope: 'turnkey', id: 'cosmetic' } : null;
  return {
    priceFrom,
    priceFromValue: value,
    priceFromSuffix: suffix,
    pricingScope: pricingKey?.scope || 'serviceCategories',
    pricingId: pricingKey?.id || id,
  };
};

export const formatCategoryPrice = (category, price) => {
  const formatted = Number(price).toLocaleString('ru-RU');
  const suffix = category.priceFromSuffix ? ` ${category.priceFromSuffix.replace(/^\/+/, '/').trim()}` : '';
  return `от ${formatted} ₽${suffix}`.replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').trim();
};

export const SERVICE_CATEGORIES = catalog.map(([id,name,image,priceFrom,description]) => ({ id, name, slug:id, image: categoryImages[id] || image, imageAlt: categoryMetadata[id].alt, ...createCategoryPrice(id, priceFrom), description, seo: categoryMetadata[id], showOnHome: !HOME_HIDDEN_CATEGORY_IDS.has(id) }));
export const PRICE_LIST = Object.fromEntries(catalog.flatMap(([, , , , , sections]) => sections.map(([id,name,,items]) => [id,{ name, items:items.map((item,index)=>createServiceItem(id,item,index)) }])));
export const CATEGORY_PRICE_MAP = Object.fromEntries(catalog.map(([id,,,,,sections]) => [id,sections.map(([sectionId])=>sectionId)]));
export const SERVICES_CATALOG = catalog.map(([id,name,image,priceFrom,,sections]) => ({ id,name,icon:'•',image:categoryImages[id] || image,imageAlt:categoryMetadata[id].alt,...createCategoryPrice(id, priceFrom),seo:categoryMetadata[id],direct:sections.length===1,items:sections.length===1?sections[0][3].map((item,index)=>createServiceItem(sections[0][0],item,index)):undefined,subcategories:sections.length>1?sections.map(([sectionId,sectionName,sectionImage,items])=>({id:sectionId,name:sectionName,image:subcategoryImages[sectionId] || sectionImage,imageAlt:categoryMetadata[id].alt,items:items.map((item,index)=>createServiceItem(sectionId,item,index))})):undefined }));
export const TURNKEY_OPTIONS = [
  { id:'cosmetic', name:'Косметический', price:4500, unit:'м²' },
  { id:'capital', name:'Капитальный', price:7000, unit:'м²' },
  { id:'turnkey', name:'Под ключ', price:9000, unit:'м²' },
];

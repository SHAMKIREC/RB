import vetonitImage from '../assets/images/services/materials/material_vetonit_lr_plus (1).jpg';
import ceresitImage from '../assets/images/services/materials/material_ceresit_ct17.jpg';
import nivelirImage from '../assets/images/services/materials/material_volma_nivelir.jpg';
import m300Image from '../assets/images/services/materials/material_sartexim_m300.jpg';
import m200Image from '../assets/images/services/materials/material_sartexim_m200.jpg';
import volmaSloyImage from '../assets/images/services/materials/material_volma_sloy.jpg';
import mp75Image from '../assets/images/services/materials/material_knauf_mp75.jpg';
import danogipsImage from '../assets/images/services/materials/material_danogips_superfinish.jpg';

export const MATERIALS = [
  { id: 'vetonit-lr-plus', name: 'Vetonit LR+', brand: 'Vetonit', type: 'Финишная шпаклёвка', image: vetonitImage, compatibleWorkIds: ['paint_putty_wallpaper'], description: 'Финишная шпаклёвка для тонкого выравнивания стен и потолков перед поклейкой обоев или дальнейшей отделкой.', packageAmount: 20, packageUnit: 'кг', pricePerPackage: 920 },
  { id: 'ceresit-ct17', name: 'Ceresit CT 17', brand: 'Ceresit', type: 'Грунтовка глубокого проникновения', image: ceresitImage, compatibleWorkIds: ['pl_prime'], description: 'Грунтовка глубокого проникновения для подготовки стен, пола и других оснований перед штукатуркой, шпаклёвкой и другими отделочными работами.', packageAmount: 10, packageUnit: 'л', pricePerPackage: 1320 },
  { id: 'volma-nivelir', name: 'Волма Нивелир Экспресс', brand: 'Волма', type: 'Самовыравнивающаяся смесь', image: nivelirImage, compatibleWorkIds: ['rough_self_level'], description: 'Самовыравнивающаяся смесь для выравнивания пола и подготовки ровного основания перед укладкой напольного покрытия.', packageAmount: 25, packageUnit: 'кг', pricePerPackage: 492 },
  { id: 'sartexim-m300', name: 'Сартэксим М-300', brand: 'Сартэксим', type: 'Пескобетон', image: m300Image, compatibleWorkIds: ['rough_concrete_screed'], description: 'Пескобетон М-300 для устройства прочных стяжек пола, ремонта оснований и других цементных работ.', packageAmount: 25, packageUnit: 'кг', pricePerPackage: 215 },
  { id: 'sartexim-m200', name: 'Сартэксим М-200', brand: 'Сартэксим', type: 'Универсальная сухая смесь', image: m200Image, compatibleWorkIds: ['rough_manual_screed'], description: 'Универсальная сухая смесь М-200 для стяжек, ремонта, выравнивания и общестроительных работ.', packageAmount: 25, packageUnit: 'кг', pricePerPackage: 192 },
  { id: 'volma-sloy', name: 'Волма Слой', brand: 'Волма', type: 'Гипсовая штукатурка', image: volmaSloyImage, compatibleWorkIds: ['pl_gypsum'], description: 'Гипсовая штукатурка для ручного выравнивания стен внутри помещений перед шпаклёвкой, покраской или поклейкой обоев.', packageAmount: 30, packageUnit: 'кг', pricePerPackage: 478 },
  { id: 'knauf-mp75', name: 'Knauf MP 75 Master', brand: 'Knauf', type: 'Гипсовая штукатурка машинного нанесения', image: mp75Image, compatibleWorkIds: ['pl_gypsum'], description: 'Гипсовая штукатурка для выравнивания стен внутри помещений и подготовки поверхности под дальнейшую отделку.', packageAmount: 30, packageUnit: 'кг', pricePerPackage: 485 },
  { id: 'danogips-superfinish', name: 'Danogips SuperFinish', brand: 'Danogips', type: 'Готовая полимерная финишная шпаклёвка', image: danogipsImage, compatibleWorkIds: ['paint_putty_paint'], description: 'Готовая полимерная финишная шпаклёвка для окончательного выравнивания стен и потолков перед покраской.', packageAmount: 18.1, packageUnit: 'кг', pricePerPackage: 1458 },
];

export const getMaterialsForWork = (workId) => MATERIALS.filter((material) => material.compatibleWorkIds.includes(workId));

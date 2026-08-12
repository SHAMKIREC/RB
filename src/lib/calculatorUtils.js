export const safeNumber = (value) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;

const formatMoney = (value) => `${Math.round(safeNumber(value)).toLocaleString('ru-RU')} ₽`;

export function buildEstimateText({ works = [], materials = [], worksSubtotal = 0, materialsSubtotal = 0 }) {
  const repairType = works.some((work) => work.id === 'turnkey') ? 'Ремонт под ключ' : 'Индивидуальный ремонт';
  const lines = ['Здравствуйте!', 'Хочу заказать ремонт.', '', 'Предварительная смета:', '', 'Тип:', repairType, '', 'Работы:'];
  lines.push(...(works.length ? works.map((work) => `• ${work.name} — ${work.quantity} ${work.unit} × ${formatMoney(work.price)} = ${formatMoney(work.total)}`) : ['• Работы не выбраны']));
  lines.push(`Количество работ: ${works.length}`);
  lines.push('', 'Материалы:');
  lines.push(...(materials.length ? materials.flatMap((material) => [
    `• ${material.name}`,
    `${material.packageAmount} ${material.packageUnit}`,
    `${material.quantity} шт. × ${formatMoney(material.pricePerPackage)} = ${formatMoney(material.total)}`,
  ]) : ['• Материалы не выбраны']));
  lines.push(`Всего материалов: ${formatMoney(materialsSubtotal)}`);
  const grandTotal = safeNumber(worksSubtotal) + safeNumber(materialsSubtotal);
  lines.push('', 'Итого:', formatMoney(grandTotal), '', 'Прошу связаться со мной.');
  return lines.join('\n');
}

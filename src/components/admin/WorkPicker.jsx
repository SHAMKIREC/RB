import { useMemo, useState } from "react";
import { CALC_CATEGORIES } from "../../lib/calcDataRamilFinal";
import { usePricingOverrides } from "../../hooks/usePricingState";
import { getCalculatorWorkPrice } from "../../lib/pricingStorage";

const allWorks = (pricingOverrides) =>
  CALC_CATEGORIES.flatMap((category) =>
    category.groups.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        mount: getCalculatorWorkPrice(item, pricingOverrides),
        categoryId: category.id,
        categoryName: category.name,
        groupId: group.id,
        groupName: group.name,
      })),
    ),
  );

export default function WorkPicker({ value = [], onChange }) {
  const pricingOverrides = usePricingOverrides();
  const works = useMemo(() => allWorks(pricingOverrides), [pricingOverrides]);
  const [categoryId, setCategoryId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [workId, setWorkId] = useState("");

  const categories = useMemo(
    () => CALC_CATEGORIES.map((category) => ({ id: category.id, name: category.name })),
    [],
  );
  const groups = useMemo(
    () =>
      CALC_CATEGORIES.find((category) => category.id === categoryId)?.groups || [],
    [categoryId],
  );
  const availableWorks = useMemo(
    () => works.filter((work) => work.categoryId === categoryId && work.groupId === groupId),
    [works, categoryId, groupId],
  );

  const add = () => {
    const work = works.find((item) => item.id === workId);
    if (!work || value.some((item) => item.workId === work.id)) return;
    onChange([
      ...value,
      {
        workId: work.id,
        title: work.name,
        unit: work.unit,
        category: work.categoryName,
        group: work.groupName,
        quantity: 0,
        unitPrice: work.mount,
        totalPrice: 0,
      },
    ]);
  };
  const update = (workId, quantity) => {
    const isEmpty = quantity === "";
    const normalizedQuantity = isEmpty
      ? ""
      : Math.max(0, Math.round(Number(quantity) || 0));
    const numericQuantity = isEmpty ? 0 : Number(normalizedQuantity);
    onChange(
      value.map((item) =>
        item.workId === workId
          ? {
              ...item,
              quantity: normalizedQuantity,
              totalPrice: item.unitPrice * numericQuantity,
            }
          : item,
      ),
    );
  };
  const remove = (workId) =>
    onChange(value.filter((item) => item.workId !== workId));
  return (
    <div className="space-y-4 rounded-xl border border-border p-3 sm:p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs font-bold">
          Категория
          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setGroupId("");
              setWorkId("");
            }}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold">
          Раздел
          <select
            value={groupId}
            disabled={!categoryId}
            onChange={(event) => {
              setGroupId(event.target.value);
              setWorkId("");
            }}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal disabled:opacity-50"
          >
            <option value="">Выберите раздел</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="text-xs font-bold">
          Работа
          <select
            value={workId}
            disabled={!groupId}
            onChange={(event) => setWorkId(event.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal disabled:opacity-50"
          >
            <option value="">Выберите работу</option>
            {availableWorks.map((work) => (
              <option key={work.id} value={work.id}>{work.name} — {work.mount} ₽/{work.unit}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={!workId}
          onClick={add}
          className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          Добавить
        </button>
      </div>
      <div className="space-y-2">
        {value.map((item) => (
          <div key={item.workId} className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-[1fr_8rem_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-sm font-bold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.unitPrice} ₽/{item.unit}</p>
            </div>
            <label className="text-xs font-bold">
              Объём
              <input
                type="number"
                min="0"
                step="1"
                value={item.quantity ?? 0}
                onChange={(event) => update(item.workId, event.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-normal"
              />
            </label>
            <button type="button" onClick={() => remove(item.workId)} className="text-xs font-bold text-destructive">Удалить</button>
          </div>
        ))}
        {!value.length && <p className="py-2 text-center text-xs text-muted-foreground">Работы пока не выбраны.</p>}
      </div>
    </div>
  );
}

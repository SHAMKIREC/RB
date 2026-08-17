import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { CALC_CATEGORIES } from "../../lib/calcData";
import { getCalculatorWorkPrice } from "../../lib/pricingStorage";
import { usePricingOverrides } from "../../hooks/usePricingState";

const money = (value) => `${Math.round(value || 0).toLocaleString("ru-RU")} ₽`;

export default function WorkPicker({
  value = [],
  onChange,
  label = "Выбранные работы",
}) {
  const pricingOverrides = usePricingOverrides();
  const [categoryId, setCategoryId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [query, setQuery] = useState("");
  const groups =
    CALC_CATEGORIES.find((category) => category.id === categoryId)?.groups ||
    [];
  const works = useMemo(() => CALC_CATEGORIES.flatMap((category) =>
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
  ), [pricingOverrides]);
  const results = useMemo(
    () =>
      works
        .filter(
          (work) =>
            (!categoryId || work.categoryId === categoryId) &&
            (!groupId || work.groupId === groupId) &&
            (!query || work.name.toLowerCase().includes(query.toLowerCase())),
        )
        .slice(0, 10),
    [categoryId, groupId, query, works],
  );
  const add = (work) => {
    if (!value.some((item) => item.workId === work.id))
      onChange([
        ...value,
        {
          workId: work.id,
          categoryId: work.categoryId,
          groupId: work.groupId,
          title: work.name,
          unit: work.unit,
          quantity: 0,
          unitPrice: work.mount,
          totalPrice: 0,
        },
      ]);
  };
  const update = (workId, quantity) => {
    const normalizedQuantity = Math.max(0, Math.round(Number(quantity) || 0));
    return (
    onChange(
      value.map((item) =>
        item.workId === workId
          ? {
              ...item,
              quantity: normalizedQuantity,
              totalPrice: item.unitPrice * normalizedQuantity,
            }
          : item,
      ),
    )
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
            }}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Все категории</option>
            {CALC_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold">
          Группа
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            disabled={!categoryId}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Все группы</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-xs font-bold">
        Найти работу
        <div className="relative mt-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например, укладка ламината"
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>
      </label>
      <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
        {results.map((work) => (
          <div
            key={work.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs"
          >
            <span className="min-w-0">
              <b className="block truncate">{work.name}</b>
              <span className="text-muted-foreground">
                {money(work.mount)} / {work.unit}
              </span>
            </span>
            <button
              type="button"
              disabled={value.some((item) => item.workId === work.id)}
              onClick={() => add(work)}
              className="shrink-0 rounded-lg border border-primary/30 px-2 py-1 font-bold text-primary disabled:opacity-40"
            >
              Добавить
            </button>
          </div>
        ))}
        {!results.length && (
          <p className="py-3 text-center text-xs text-muted-foreground">
            Работы не найдены.
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <p className="mb-2 text-sm font-black">{label}</p>
        {value.length ? (
          <table className="w-full min-w-[580px] text-left text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-2">Работа</th>
                <th className="pb-2">Количество</th>
                <th className="pb-2">Единица</th>
                <th className="pb-2">Цена</th>
                <th className="pb-2">Итог</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {value.map((item) => (
                <tr key={item.workId} className="border-t border-border">
                  <td className="py-2 pr-3 font-medium">{item.title}</td>
                  <td className="py-2">
                    <input
                      aria-label={`Количество: ${item.title}`}
                      value={item.quantity}
                      onChange={(event) =>
                        update(item.workId, event.target.value)
                      }
                type="number"
                min="0"
                step="1"
                      className="w-16 rounded border border-border bg-background px-2 py-1"
                    />
                  </td>
                  <td className="py-2">{item.unit}</td>
                  <td className="py-2">{money(item.unitPrice)}</td>
                  <td className="py-2 font-bold">{money(item.totalPrice)}</td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      aria-label={`Удалить: ${item.title}`}
                      onClick={() => remove(item.workId)}
                      className="rounded p-1 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            Добавьте работы из списка выше.
          </p>
        )}
      </div>
    </div>
  );
}

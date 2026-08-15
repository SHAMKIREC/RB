import { useEffect, useMemo, useState } from "react";
import AdminGate from "../components/AdminGate";
import WorkPicker from "../components/admin/WorkPicker";
import PhotoUploader from "../components/PhotoUploader";
import {
  deleteOrder,
  getOrders,
  saveOrder,
  setOrderPublished,
  setOrderStatus,
} from "../lib/ordersStorage";
/** @returns {any} */
const blank = () => ({
  number: "",
  title: "",
  location: "",
  description: "",
  preferredDeadline: "",
  selectedWorks: [],
  materialsSubtotal: 0,
  surcharges: 0,
  photos: [],
  status: "draft",
  isPublished: false,
  isManualTotal: false,
  finalTotal: "",
  contractorPayment: 0,
  clientPrice: 0,
  ownerExpenses: 0,
});
const money = (v) => `${Math.round(v || 0).toLocaleString("ru-RU")} ₽`;
const integerQuantity = (value) => Math.max(0, Math.round(Number(value) || 0));
const requestError = (error, fallback) => error?.message || fallback;
const normalizeSelectedWorks = (selectedWorks) =>
  (Array.isArray(selectedWorks) ? selectedWorks : []).map((work) => {
    const quantity = integerQuantity(work.quantity);
    return { ...work, quantity, totalPrice: Number(work.unitPrice || 0) * quantity };
  });

export default function AdminOrders() {
  return (
    <AdminGate>
      <Content />
    </AdminGate>
  );
}
function Content() {
  const [orders, setOrders] = useState([]),
    [form, setForm] = useState(blank()),
    [error, setError] = useState("");
  const refresh = async () => setOrders(await getOrders());
  const runListAction = async (action, failureMessage) => {
    try {
      await action();
    } catch {
      setError(failureMessage);
      try { await refresh(); } catch { /* keep the current list */ }
      return false;
    }
    try {
      await refresh();
      setError("");
    } catch {
      setError("Изменение сохранено, но список не удалось обновить. Обновите страницу.");
    }
    return true;
  };
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const nextOrders = await getOrders();
        if (active) setOrders(nextOrders);
      } catch {
        if (active) setError("Не удалось загрузить заказы. Попробуйте обновить страницу.");
      }
    };
    load();
    return () => { active = false; };
  }, []);
  const works = useMemo(
    () => form.selectedWorks.reduce((s, w) => s + Number(w.totalPrice || 0), 0),
    [form.selectedWorks],
  );
  const calculatedCost = works;
  const contractorPayment = Number(form.contractorPayment || 0);
  const clientPrice = Number(form.clientPrice || 0);
  const ownerExpenses = Number(form.ownerExpenses || 0);
  const expectedProfit = clientPrice - contractorPayment - ownerExpenses;
  const calculatedTotal =
    works + Number(form.materialsSubtotal || 0) + Number(form.surcharges || 0);
  const displayedTotal = form.isManualTotal
    ? Number(form.finalTotal || 0)
    : calculatedTotal;
  const save = async (published) => {
    const selectedWorks = normalizeSelectedWorks(form.selectedWorks);
    const normalizedWorksSubtotal = selectedWorks.reduce(
      (sum, work) => sum + Number(work.totalPrice || 0),
      0,
    );
    const normalizedCalculatedTotal =
      normalizedWorksSubtotal + Number(form.materialsSubtotal || 0) + Number(form.surcharges || 0);
    const normalizedDisplayedTotal = form.isManualTotal
      ? Number(form.finalTotal || 0)
      : normalizedCalculatedTotal;
    if (published && !selectedWorks.length) {
      setError("Добавьте хотя бы одну работу.");
      return;
    }
    const missingVolume = selectedWorks.find(
      (work) =>
        !Number.isFinite(Number(work.quantity)) || Number(work.quantity) <= 0,
    );
    if (published && missingVolume) {
      setError(`Укажите объём для работы: ${missingVolume.title}.`);
      return;
    }
    if (form.isManualTotal && form.finalTotal === "") {
      setError("Укажите итоговую сумму.");
      return;
    }
    if (published && normalizedDisplayedTotal <= 0) {
      setError("Опубликованный заказ должен иметь итоговую сумму больше 0 ₽.");
      return;
    }
    if (published && contractorPayment <= 0) {
      setError("Укажите выплату исполнителю.");
      return;
    }
    if (published && clientPrice <= 0) {
      setError("Укажите цену для клиента.");
      return;
    }
    if (ownerExpenses < 0) {
      setError("Расходы владельца не могут быть отрицательными.");
      return;
    }
    setError("");
    try {
      await saveOrder({
        ...form,
        selectedWorks,
        workSubtotal: normalizedWorksSubtotal,
        calculatedCost: normalizedWorksSubtotal,
        contractorPayment,
        clientPrice,
        ownerExpenses,
        expectedProfit,
        calculatedTotal: normalizedCalculatedTotal,
        finalTotal: normalizedDisplayedTotal,
        total: normalizedDisplayedTotal,
        materialsSubtotal: Number(form.materialsSubtotal || 0),
        surcharges: Number(form.surcharges || 0),
        isPublished: published,
        status: published ? "active" : "draft",
      });
      setForm(blank());
      try {
        await refresh();
      } catch {
        setError("Заказ сохранён, но список не удалось обновить. Обновите страницу.");
      }
    } catch (saveError) {
      setError(requestError(saveError, "Не удалось сохранить заказ в Supabase."));
    }
  };
  return (
    <div className="page-shell py-6 sm:py-10">
      <div className="flex flex-col items-stretch gap-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
        <h1 className="text-3xl font-black">Управление заказами</h1>
        <button
          onClick={() => {
            setForm(blank());
            setError("");
          }}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white min-[420px]:w-auto min-[420px]:py-2"
        >
          Создать заказ
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await save(false);
          }}
          className="w-full min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4 sm:space-y-5 sm:p-5"
        >
          <section>
            <h2 className="font-black">Основная информация</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["title", "Название заказа"],
                ["number", "Номер заказа"],
                ["location", "Город, район или улица"],
                ["preferredDeadline", "Желаемый срок"],
              ].map(([key, label]) => (
                <label key={key} className="text-sm font-bold">
                  {label}
                  <input
                    required={key === "title" || key === "location"}
                    value={key === "number" && !form.id ? "Новый заказ" : form[key]}
                    readOnly={key === "number"}
                    onChange={(e) => {
                      if (key !== "number") setForm({ ...form, [key]: e.target.value });
                    }}
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                  />
                </label>
              ))}
            </div>
            <label className="mt-3 block text-sm font-bold">
              Описание заказа
              <textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
              />
            </label>
          </section>
          <PhotoUploader value={form.photos} onChange={(photos) => setForm({ ...form, photos })} label="Фотографии заказа" />
          <section>
            <h2 className="font-black">Работы и смета</h2>
            <div className="mt-3">
              <WorkPicker
                value={form.selectedWorks}
                onChange={(selectedWorks) =>
                  setForm({ ...form, selectedWorks })
                }
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">
                Стоимость работ
                <output className="mt-1 block rounded-xl bg-secondary px-3 py-2 font-normal">
                  {money(works)}
                </output>
              </label>
              <label className="text-sm font-bold">
                Стоимость материалов
                <input
                  type="number"
                  min="0"
                  value={form.materialsSubtotal}
                  onChange={(e) =>
                    setForm({ ...form, materialsSubtotal: e.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                />
              </label>
              <label className="text-sm font-bold">
                Дополнительные расходы
                <input
                  type="number"
                  min="0"
                  value={form.surcharges}
                  onChange={(e) =>
                    setForm({ ...form, surcharges: e.target.value })
                  }
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                />
              </label>
              <label className="flex items-end gap-2 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={Boolean(form.isManualTotal)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isManualTotal: e.target.checked,
                      finalTotal: e.target.checked
                        ? form.finalTotal
                        : calculatedTotal,
                    })
                  }
                />
                Указать итоговую сумму вручную
              </label>
            </div>
            {form.isManualTotal && (
              <div className="mt-3">
                <label className="text-sm font-bold">
                  Итоговая сумма заказа
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.finalTotal}
                    onChange={(e) =>
                      setForm({ ...form, finalTotal: e.target.value })
                    }
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"
                  />
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  Расчётная сумма: {money(calculatedTotal)}. Ручная сумма может
                  учитывать скидку, договорённость или дополнительные работы.
                </p>
              </div>
            )}
            <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 font-black text-primary">
              Итого: {money(displayedTotal)}
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <h2 className="font-black">Финансы заказа</h2>
              <p className="mt-1 text-xs text-muted-foreground">Укажите выплату исполнителю, цену для клиента и расходы владельца.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold">Расчётная стоимость работ<output className="mt-1 block rounded-xl bg-secondary px-3 py-2 font-normal">{money(calculatedCost)}</output></label>
                <label className="text-sm font-bold">Выплата исполнителю<input type="number" min="0" step="1" value={form.contractorPayment} onChange={(event) => setForm({ ...form, contractorPayment: event.target.value })} className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"/><span className="mt-1 block text-xs font-normal text-muted-foreground">Эту сумму увидит мастер в разделе активных заказов.</span></label>
                <label className="text-sm font-bold">Цена для клиента<input type="number" min="0" step="1" value={form.clientPrice} onChange={(event) => setForm({ ...form, clientPrice: event.target.value })} className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"/><span className="mt-1 block text-xs font-normal text-muted-foreground">Эта сумма доступна только владельцу сайта.</span></label>
                <label className="text-sm font-bold">Расходы владельца<input type="number" min="0" step="1" value={form.ownerExpenses} onChange={(event) => setForm({ ...form, ownerExpenses: event.target.value })} className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal"/><span className="mt-1 block text-xs font-normal text-muted-foreground">Например: доставка, реклама, выезд, комиссия.</span></label>
              </div>
              <p className={`mt-4 rounded-xl px-3 py-2 font-black ${expectedProfit < 0 ? 'bg-destructive/10 text-destructive' : expectedProfit > 0 ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-secondary text-foreground'}`}>Ожидаемая прибыль: {money(expectedProfit)}</p>
              {expectedProfit < 0 && <p className="mt-2 text-xs text-destructive">Выплата исполнителю и расходы превышают цену для клиента.</p>}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </section>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="w-full rounded-xl border border-border px-4 py-2 text-sm font-bold sm:w-auto">
              Сохранить черновик
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white sm:w-auto"
            >
              Опубликовать заказ
            </button>
          </div>
        </form>
        <aside className="min-w-0 space-y-2">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border border-border bg-card p-3 text-sm"
            >
              <b>
                №{o.number} {o.title}
              </b>
              <p>{money(o.finalTotal ?? o.total)}</p>
              <button
                onClick={() =>
                  setForm({
                    ...o,
                    selectedWorks: normalizeSelectedWorks(o.selectedWorks),
                    isManualTotal: Boolean(o.isManualTotal),
                    finalTotal: o.finalTotal ?? o.total ?? "",
                    contractorPayment: o.contractorPayment ?? o.finalTotal ?? o.total ?? o.calculatedTotal ?? 0,
                    clientPrice: o.clientPrice ?? o.finalTotal ?? o.total ?? o.contractorPayment ?? 0,
                    ownerExpenses: o.ownerExpenses ?? 0,
                  })
                }
                className="text-primary"
              >
                Редактировать
              </button>
              <button
                onClick={async () => {
                  await runListAction(
                    () => setOrderPublished(o.id, !o.isPublished),
                    "Не удалось изменить публикацию заказа. Попробуйте ещё раз.",
                  );
                }}
                className="ml-3"
              >
                {o.isPublished ? "Снять" : "Опубликовать"}
              </button>
              <button
                onClick={async () => {
                  await runListAction(
                    () => setOrderStatus(o.id, "closed"),
                    "Не удалось закрыть заказ. Попробуйте ещё раз.",
                  );
                }}
                className="ml-3"
              >
                Закрыть
              </button>
              <button
                onClick={async () => {
                  await runListAction(
                    () => deleteOrder(o.id),
                    "Не удалось полностью удалить заказ. Попробуйте ещё раз.",
                  );
                }}
                className="ml-3 text-destructive"
              >
                Удалить
              </button>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

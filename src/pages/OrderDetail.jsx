import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getOrder } from '../lib/ordersStorage';
import OrderResponseModal from '../components/OrderResponseModal';
import SeoHead from '../components/SeoHead';
import RbProGate from '../components/RbProGate';

const money = (value) => `${Math.round(Number(value) || 0).toLocaleString('ru-RU')} ₽`;
const payment = (order) => Number(order.contractorPayment ?? order.finalTotal ?? order.total ?? order.calculatedTotal ?? 0) || 0;

export default function OrderDetail() {
  return <RbProGate><OrderDetailContent /></RbProGate>;
}

function OrderDetailContent() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setLoadError(false);
    getOrder(orderId).then((item) => {
      setOrder(item);
      setLoaded(true);
    }).catch(() => {
      setOrder(null);
      setLoadError(true);
      setLoaded(true);
    });
  }, [orderId]);

  if (!loaded) return <div className="page-shell py-16" />;
  if (loadError) return <><SeoHead title="RB PRO | РБ" description="Закрытый раздел мастеров." noIndex noFollow socialPreview={false} /><div className="page-shell py-16">Не удалось загрузить данные. Попробуйте обновить страницу.</div></>;
  if (!order || !order.isPublished) return <><SeoHead title="Заказ не найден | RB PRO" description="Заказ не найден." noIndex noFollow socialPreview={false} /><div className="page-shell py-16">Заказ не найден.</div></>;

  return <div className="page-shell py-10 sm:py-16">
    <SeoHead title={`Заказ №${order.number} | RB PRO`} description="Закрытый заказ для мастеров RB PRO." noIndex noFollow socialPreview={false} />
    <Link to="/orders" className="inline-flex gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" />RB PRO</Link>
    <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section>
        <p className="font-mono text-sm font-bold text-primary">Заказ №{order.number}</p>
        <h1 className="mt-2 text-3xl font-black">{order.title}</h1>
        <p className="mt-2 text-muted-foreground">{order.location} · Срок: {order.preferredDeadline || 'по договорённости'}</p>
        <p className="mt-5 whitespace-pre-line text-sm">{order.description}</p>
        <h2 className="mt-7 font-black">Состав работ</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">{order.selectedWorks?.filter((work) => Number(work.quantity) > 0).map((work) => <div key={work.workId || work.title} className="border-b border-border px-5 py-3 text-sm">{work.title} — {work.quantity} {work.unit}</div>)}</div>
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-card p-5">
        <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-700 dark:text-green-400">Активен</span>
        <p className="mt-5 text-sm text-muted-foreground">Оплата исполнителю</p>
        <p className="mt-1 text-2xl font-black text-primary">{money(payment(order))}</p>
        <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white"><MessageCircle className="mr-1 inline h-4 w-4" />Откликнуться</button>
      </aside>
    </div>
    {open && <OrderResponseModal number={order.number} onClose={() => setOpen(false)} />}
  </div>;
}

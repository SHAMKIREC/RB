import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import { getPublishedOrders } from '../lib/ordersStorage';
import OrderResponseModal from '../components/OrderResponseModal';
const money = (value) => `${Math.round(Number(value) || 0).toLocaleString('ru-RU')} ₽`;
const payment = (order) => Number(order.contractorPayment ?? order.finalTotal ?? order.total ?? order.calculatedTotal ?? 0) || 0;
const PAGE_SIZE = 12;

const appendUnique = (current, next) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  next.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [responseOrder, setResponseOrder] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);

  useEffect(() => {
    let active = true;
    getPublishedOrders(0, PAGE_SIZE - 1).then(({ items, hasMore: more }) => {
      if (!active) return;
      setOrders(items);
      setNextOffset(items.length);
      setHasMore(more);
      setLoadError(false);
    }).catch(() => {
      if (active) setLoadError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setLoadMoreError(false);
    try {
      const from = nextOffset;
      const { items, hasMore: more } = await getPublishedOrders(from, from + PAGE_SIZE - 1);
      setOrders((current) => appendUnique(current, items));
      setNextOffset(from + items.length);
      setHasMore(more);
    } catch {
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return <div className="page-shell py-7 sm:py-10"><div className="mb-5"><p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Заказы</p><h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Активные заказы</h1><p className="max-w-2xl text-sm text-muted-foreground">Выберите подходящий заказ и свяжитесь с нами, указав номер сметы.</p></div>{loading ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Загрузка...</div> : loadError ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Не удалось загрузить данные. Попробуйте обновить страницу.</div> : orders.length ? <><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{orders.map((order) => <article key={order.id} className="rb-card rb-card-action overflow-hidden rounded-2xl">{order.photos?.[0] && <img src={order.photos[0]} alt={`Фото заказа «${order.title}»`} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />}<div className="p-5"><div className="flex justify-between"><span className="font-mono text-xs font-bold text-primary">Заказ №{order.number}</span><span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-700">Активен</span></div><h2 className="mt-2 text-lg font-black">{order.title}</h2><p className="mt-1 flex gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{order.location}</p><p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{order.description}</p><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><span>{order.worksCount ?? order.selectedWorks?.length ?? 0} видов работ</span><b className="text-right text-primary">Оплата исполнителю: {money(payment(order))}</b><span>Срок: {order.preferredDeadline || 'по договорённости'}</span></div><div className="mt-5 grid grid-cols-2 gap-2"><Link to={`/orders/${order.id}`} className="rounded-xl border border-primary/30 py-2.5 text-center text-xs font-bold hover:bg-primary/5">Посмотреть смету</Link><button onClick={() => setResponseOrder(order)} className="rounded-xl bg-primary py-2.5 text-xs font-bold text-white"><MessageCircle className="mr-1 inline h-4 w-4" />Откликнуться</button></div></div></article>)}</div>{loadMoreError && <p className="mt-4 text-center text-sm text-muted-foreground">Не удалось загрузить данные. Попробуйте ещё раз.</p>}{hasMore && <div className="mt-6 text-center"><button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loadingMore ? 'Загрузка...' : 'Показать ещё'}</button></div>}</> : <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Активных заказов пока нет.</div>}{responseOrder && <OrderResponseModal number={responseOrder.number} onClose={() => setResponseOrder(null)} />}</div>;
}

import { useEffect, useState } from "react";
import { MapPin, Star, MessageSquareText, ShieldCheck, Quote, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { getPublishedReviews } from "../lib/reviewsStorage";

const photoSrc = (photo) => (typeof photo === "string" ? photo : photo?.src || "");
const PAGE_SIZE = 12;

const appendUnique = (current, next) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  next.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);

  useEffect(() => {
    let active = true;
    let hasLoaded = false;
    const refresh = () => getPublishedReviews(0, PAGE_SIZE - 1).then(({ items, hasMore: more }) => {
      if (!active) return;
      hasLoaded = true;
      setReviews(items);
      setNextOffset(items.length);
      setHasMore(more);
      setLoadError(false);
    }).catch(() => {
      if (active && !hasLoaded) setLoadError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    refresh();
    const timer = window.setInterval(refreshWhenVisible, 45 * 60 * 1000);
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setLoadMoreError(false);
    try {
      const from = nextOffset;
      const { items, hasMore: more } = await getPublishedReviews(from, from + PAGE_SIZE - 1);
      setReviews((current) => appendUnique(current, items));
      setNextOffset(from + items.length);
      setHasMore(more);
    } catch {
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="reviews-page pb-10 pt-6 sm:pb-14 sm:pt-9">
      <div className="page-shell"><section className="page-top-hero relative mb-7 overflow-hidden bg-[#242321] text-white sm:mb-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(255,80,20,.30),transparent_34%),radial-gradient(circle_at_5%_90%,rgba(255,120,40,.12),transparent_35%)]" /><div className="relative px-5 py-9 sm:px-10 sm:py-14"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/35 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-orange-300"><MessageSquareText className="h-4 w-4" /> Отзывы</div><h1 className="text-4xl font-black leading-none sm:text-6xl">Говорят наши <span className="text-primary">клиенты</span></h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-lg">Реальные впечатления о выполненном ремонте и строительных работах.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="https://vk.ru/club237262784" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5">Оставить отзыв <ExternalLink className="h-4 w-4" /></a><span className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[.07] px-5 py-3 text-sm font-bold text-white/75"><ShieldCheck className="h-5 w-5 text-primary" /> Публикуем после проверки</span></div></motion.div></div></section></div>
      <div className="page-shell">
      {loading ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Загрузка...</div>
      ) : loadError ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Не удалось загрузить данные. Попробуйте обновить страницу.</div>
      ) : reviews.length ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={review.id} className="rb-card relative flex flex-col overflow-hidden rounded-3xl border-2 border-primary/35 bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl sm:p-6">
                <Quote className="absolute right-5 top-5 h-12 w-12 text-primary/[.08]" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-black text-foreground">{review.clientName}</h2>
                    {review.location && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />{review.location}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-sm font-bold text-primary">
                    <Star className="h-4 w-4 fill-current" />{review.rating}
                  </span>
                </div>
                <span className="mt-4 w-fit rounded-full border border-primary/15 bg-primary/[.07] px-3 py-1.5 text-[11px] font-bold text-primary">{review.serviceTitle}</span>
                <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-foreground/75">{review.reviewText}</p>
                {Array.isArray(review.photos) && review.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {review.photos.map((photo, index) => (
                      <img key={index} src={photoSrc(photo)} alt={`Фото к отзыву ${index + 1}`} loading="lazy" decoding="async" className="aspect-square w-full rounded-lg border border-border bg-secondary/50 object-contain" />
                    ))}
                  </div>
                )}
                <p className="mt-auto pt-5 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("ru-RU")}</p>
              </motion.article>
            ))}
          </div>
          {loadMoreError && <p className="mt-4 text-center text-sm text-muted-foreground">Не удалось загрузить данные. Попробуйте ещё раз.</p>}
          {hasMore && <div className="mt-6 text-center"><button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loadingMore ? 'Загрузка...' : 'Показать ещё'}</button></div>}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Отзывов пока нет.</div>
      )}
      </div>
    </div>
  );
}

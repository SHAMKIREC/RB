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
    <div className="reviews-page pb-10 sm:pb-14">
      <div className="page-shell pt-7 sm:pt-10"><motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="catalog-page-hero mb-3"><p className="mb-1 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-primary"><MessageSquareText className="h-4 w-4" /> Отзывы</p><h1 className="mb-2 text-3xl font-black sm:text-4xl">Говорят наши клиенты</h1><p className="max-w-2xl text-sm text-white/65">Реальные впечатления о выполненном ремонте и строительных работах.</p></motion.section><div className="mb-5 grid grid-cols-2 gap-2"><a href="https://vk.ru/club237262784" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-center text-xs font-black text-white shadow-md shadow-orange-600/20 transition active:scale-[.98] sm:text-sm">Оставить отзыв <ExternalLink className="h-3.5 w-3.5" /></a><span className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-2.5 text-center text-xs font-bold text-muted-foreground sm:text-sm"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> После проверки</span></div></div>
      <div className="page-shell">
      {loading ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Загрузка...</div>
      ) : loadError ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Не удалось загрузить данные. Попробуйте обновить страницу.</div>
      ) : reviews.length ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={review.id} className="rb-card relative overflow-hidden rounded-3xl border-2 border-primary/35 bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl sm:p-6">
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
                  <div className={`mt-4 grid gap-2 ${review.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {review.photos.map((photo, index) => (
                      <img key={index} src={photoSrc(photo)} alt={`Фото к отзыву ${index + 1}`} loading="lazy" decoding="async" className={`w-full rounded-xl border border-border bg-secondary/50 object-cover ${review.photos.length === 1 ? "max-h-80 aspect-[4/3]" : "aspect-square"}`} />
                    ))}
                  </div>
                )}
                <p className="mt-4 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("ru-RU")}</p>
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

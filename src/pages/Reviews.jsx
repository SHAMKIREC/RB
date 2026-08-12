import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { getPublishedReviews } from "../lib/reviewsStorage";

const photoSrc = (photo) => (typeof photo === "string" ? photo : photo?.src || "");

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { getPublishedReviews().then(setReviews).catch(() => setReviews([])); }, []);

  return (
    <div className="page-shell py-7 sm:py-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">ОТЗЫВЫ</p>
          <h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Отзывы клиентов</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Опубликованные отзывы о выполненных работах.</p>
        </div>
        <Link to="/reviews/new" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">Оставить отзыв</Link>
      </div>
      {reviews.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="rb-card flex flex-col rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-black text-foreground">{review.clientName}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />{review.location}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-sm font-bold text-primary">
                  <Star className="h-4 w-4 fill-current" />{review.rating}
                </span>
              </div>
              <span className="mt-4 w-fit rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">{review.serviceTitle}</span>
              <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-muted-foreground">{review.reviewText}</p>
              {Array.isArray(review.photos) && review.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {review.photos.map((photo, index) => (
                    <img key={index} src={photoSrc(photo)} alt={`Фото к отзыву ${index + 1}`} className="aspect-square w-full rounded-lg border border-border bg-secondary/50 object-contain" />
                  ))}
                </div>
              )}
              <p className="mt-auto pt-5 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("ru-RU")}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">Отзывов пока нет.</div>
      )}
    </div>
  );
}

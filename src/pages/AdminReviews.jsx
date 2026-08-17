import { useEffect, useState } from "react";
import { Image, MessageCircle, Star, Wrench } from "lucide-react";
import AdminGate from "../components/AdminGate";
import PhotoUploader from "../components/PhotoUploader";
import {
  deleteReview,
  getReviews,
  saveReview,
  setReviewStatus,
} from "../lib/reviewsStorage";

const statusLabel = {
  pending: "Новые отзывы",
  published: "Опубликованные",
  rejected: "Отклонённые",
};
const photoSrc = (photo) => (typeof photo === "string" ? photo : photo?.src || "");
const toPhotoRecords = (photos) => (Array.isArray(photos) ? photos : [])
  .map((photo, index) => {
    const src = photoSrc(photo);
    return src ? { ...photo, src, path: photo?.path, file: photo?.file, name: photo?.name || `photo-${index + 1}` } : null;
  })
  .filter(Boolean);

function FormLabel({ icon: Icon, children, privateNote = false }) {
  return <span className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-primary" />{children}{privateNote && <small className="ml-1 font-normal text-muted-foreground">Не отображается публично</small>}</span>;
}

function RatingStars({ rating }) {
  const value = Number(rating || 0);
  return <span aria-label={`Оценка ${value} из 5`} className="ml-2 inline-flex gap-0.5 align-middle text-primary">
    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < value ? 'fill-current' : 'opacity-25'}`} />)}
  </span>;
}

export default function AdminReviews() {
  return (
    <AdminGate>
      <Content />
    </AdminGate>
  );
}

function Content() {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState("");
  const refresh = async () => setReviews(await getReviews());
  useEffect(() => {
    let active = true;
    getReviews()
      .then((items) => { if (active) setReviews(items); })
      .catch(() => { if (active) setActionError("Не удалось загрузить отзывы. Попробуйте обновить страницу."); });
    return () => { active = false; };
  }, []);

  const act = async (callback) => {
    try {
      await callback();
    } catch (error) {
      setActionError(error?.message || "Не удалось сохранить изменения в Supabase.");
      return false;
    }
    try {
      await refresh();
      setActionError("");
    } catch {
      setActionError("Изменение сохранено, но список не удалось обновить. Обновите страницу.");
    }
    return true;
  };

  const saveEditing = async (event) => {
    event.preventDefault();
    if (!editing) return;
    const saved = await act(() => saveReview({
      ...editing,
      rating: Number(editing.rating),
      photos: toPhotoRecords(editing.photos),
    }));
    if (saved) setEditing(null);
  };

  return (
    <div className="page-shell min-w-0 py-6 sm:py-10"><p className="mt-3 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-950">Размещайте только фотографии и тексты, на публикацию которых заказчик дал разрешение. Не загружайте лица людей, документы, номера автомобилей, точные адреса и другие персональные сведения.</p><button type="button" onClick={() => setEditing({ id: null, clientName: "Клиент RB-24", location: "", serviceTitle: "", reviewText: "", rating: 5, photos: [], status: "pending", isPublished: false, adminPublicationConsent: false })} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">Создать отзыв</button>
      <h1 className="text-2xl font-black leading-tight sm:text-3xl">Управление отзывами</h1>
      <p className="mt-2 text-sm text-muted-foreground">Скопируйте разрешённый отзыв из ВКонтакте, при необходимости добавьте оценку и фотографии работы.</p>
      {actionError && <p role="alert" className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{actionError}</p>}

      {editing && (
        <form onSubmit={saveEditing} className="mt-6 space-y-4 rounded-2xl border border-primary/40 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black">Редактирование отзыва</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-sm font-bold text-muted-foreground">Отменить</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold"><FormLabel icon={Wrench}>Какая работа выполнялась</FormLabel>
              <input required maxLength={240} value={editing.serviceTitle || ""} onChange={(event) => setEditing({ ...editing, serviceTitle: event.target.value })} className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal" />
            </label>
            <label className="text-sm font-bold"><FormLabel icon={Star}>Оценка</FormLabel><RatingStars rating={editing.rating} />
              <select value={editing.rating ?? 5} onChange={(event) => setEditing({ ...editing, rating: event.target.value })} className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 font-normal">
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} из 5</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-bold"><FormLabel icon={MessageCircle}>Текст отзыва</FormLabel>
            <textarea required value={editing.reviewText || ""} onChange={(event) => setEditing({ ...editing, reviewText: event.target.value })} className="mt-1 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-2 font-normal" />
          </label>
          <label className="flex items-start gap-2 rounded-xl border border-border bg-background p-3 text-sm"><input type="checkbox" required={editing.isPublished === true} checked={editing.adminPublicationConsent === true} onChange={(event) => setEditing({ ...editing, adminPublicationConsent: event.target.checked })} className="mt-1" /><span>Получено разрешение заказчика на размещение текста и фотографий, персональные данные удалены, смысл отзыва не изменён.</span></label><PhotoUploader value={editing.photos || []} onChange={(photos) => setEditing({ ...editing, photos: toPhotoRecords(photos).slice(0, 5) })} label="Фотографии к отзыву — максимум 5" labelIcon={Image} showPhotoLabels photoLabels={(editing.photos || []).map((photo) => photo?.name || '')} />
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">Сохранить изменения</button>
        </form>
      )}

      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-3">
        {["pending", "published", "rejected"].map((status) => (
          <section key={status} className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-black">{statusLabel[status]}</h2>
            <div className="mt-3 space-y-3">
              {reviews.filter((review) => review.status === status).map((review) => (
                <article key={review.id} className="rounded-xl border border-border p-3 text-sm">
                  <b>Клиент RB-24 · {Number(review.rating || 0)}/5</b>
                  <p className="mt-1 text-xs text-muted-foreground">{review.serviceTitle || "Работа не указана"}</p>
                  <p className="mt-2 whitespace-pre-line">{review.reviewText || "Текст отзыва не добавлен"}</p>
                  {Array.isArray(review.photos) && review.photos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {review.photos.map((photo, index) => (
                        <img key={index} src={photoSrc(photo)} alt="Фото к отзыву" className="h-12 w-12 rounded border border-border object-contain" />
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("ru-RU")}</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    <button type="button" onClick={() => { if (window.confirm("Получено разрешение заказчика на размещение текста и фотографий, персональные данные удалены, смысл отзыва не изменён.")) act(() => setReviewStatus(review.id, "published")); }} className="text-primary">Опубликовать</button>
                    <button type="button" onClick={() => act(() => setReviewStatus(review.id, "rejected"))}>Отклонить</button>
                    <button type="button" onClick={() => setEditing({ ...review, photos: toPhotoRecords(review.photos) })}>Редактировать</button>
                    <button type="button" onClick={() => { if (window.confirm("Удалить отзыв?")) act(() => deleteReview(review.id)); }} className="text-destructive">Удалить</button>
                  </div>
                </article>
              ))}
              {!reviews.some((review) => review.status === status) && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  {status === "pending" ? "Новых отзывов пока нет." : "Пока нет записей."}
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

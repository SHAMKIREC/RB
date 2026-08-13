import { useState } from "react";
import { Link } from "react-router-dom";
import PhotoUploader from "../components/PhotoUploader";
import { saveReview } from "../lib/reviewsStorage";

const blank = {
  clientName: "",
  location: "",
  serviceTitle: "",
  reviewText: "",
  rating: 5,
  photos: [],
  orderNumber: "",
  contact: "",
  consent: false,
};
export default function NewReview() {
  const [form, setForm] = useState(blank);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => setForm({ ...form, [key]: value });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.consent) return;
    try {
      await saveReview({
        ...form,
        photos: form.photos,
        rating: Number(form.rating),
        status: "pending",
        isPublished: false,
      });
      setDone(true);
    } catch (submitError) {
      setError(submitError?.message || "Не удалось сохранить отзыв в Supabase.");
    }
  };

  if (done) {
    return (
      <div className="page-shell py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-black">Спасибо!</h1>
          <p className="mt-3 text-muted-foreground">
            Отзыв отправлен на проверку и появится на сайте после публикации владельцем.
          </p>
          <Link to="/reviews" className="mt-5 inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">
            К отзывам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link to="/reviews" className="text-sm text-muted-foreground hover:text-primary">← Все отзывы</Link>
        <h1 className="mt-5 text-3xl font-black">Оставить отзыв</h1>
        <p className="mt-2 text-muted-foreground">Отзыв появится на сайте только после проверки владельцем.</p>
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Ваше имя
              <input required value={form.clientName} onChange={(event) => update("clientName", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-bold">Город, район или улица
              <input required value={form.location} onChange={(event) => update("location", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-bold">Какая работа выполнялась
              <input required value={form.serviceTitle} onChange={(event) => update("serviceTitle", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-bold">Оценка
              <select value={form.rating} onChange={(event) => update("rating", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2">
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} из 5</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-bold">Текст отзыва
            <textarea required value={form.reviewText} onChange={(event) => update("reviewText", event.target.value)} className="mt-1 min-h-32 w-full rounded-xl border border-border bg-background px-3 py-2" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Номер заказа или проекта <span className="font-normal text-muted-foreground">(необязательно)</span>
              <input value={form.orderNumber} onChange={(event) => update("orderNumber", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-bold">Телефон или мессенджер <span className="font-normal text-muted-foreground">(не публикуется)</span>
              <input value={form.contact} onChange={(event) => update("contact", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
            </label>
          </div>
          <PhotoUploader
            value={form.photos}
            onChange={(photos) => update("photos", photos)}
            label="Фотографии (необязательно)"
          />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <label className="flex items-start gap-2 text-sm">
            <input required checked={form.consent} onChange={(event) => update("consent", event.target.checked)} type="checkbox" className="mt-1" />
            Согласен на проверку и публикацию отзыва.
          </label>
          <button className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">Отправить отзыв</button>
        </form>
      </div>
    </div>
  );
}

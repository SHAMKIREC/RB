import { motion } from "framer-motion";
import ReviewCard from "../components/ReviewCard";

const REVIEWS = [
  {
    name: "Алексей М.",
    date: "Февраль 2026",
    rating: 5,
    text: "Делали капитальный ремонт двушки. Ребята приехали быстро, оценили объём работ, дали точную смету. Ни разу не пришлось переплачивать. Стены идеально ровные, полы как зеркало. Рекомендую!",
    work: "Капитальный ремонт",
  },
  {
    name: "Ольга К.",
    date: "Январь 2026",
    rating: 5,
    text: "Срочно понадобилось поменять сантехнику в ванной — позвонила в воскресенье, приехали через час. Всё поставили аккуратно, чисто убрали за собой. Цены адекватные.",
    work: "Сантехника",
  },
  {
    name: "Дмитрий В.",
    date: "Декабрь 2025",
    rating: 5,
    text: "Заказывал укладку плитки в ванную и туалет. Мозаику положили идеально, швы ровные. Мастер реально знает своё дело. Буду обращаться ещё.",
    work: "Плитка",
  },
  {
    name: "Марина С.",
    date: "Ноябрь 2025",
    rating: 4,
    text: "Поклейка обоев и покраска потолка в трёх комнатах. Сделали за 3 дня. Единственное — пришлось подождать начала работ пару дней. Но результат отличный.",
    work: "Малярные работы",
  },
  {
    name: "Игорь П.",
    date: "Октябрь 2025",
    rating: 5,
    text: "Электрика под ключ в новостройке. Штробили, прокладывали кабель, ставили розетки и выключатели. Всё по схеме, ни одного косяка. Профессионалы.",
    work: "Электрика",
  },
  {
    name: "Елена Р.",
    date: "Сентябрь 2025",
    rating: 5,
    text: "Установка 5 межкомнатных дверей. Быстро, ровно, без лишнего мусора. Двери закрываются идеально. Спасибо, что не пришлось переделывать.",
    work: "Двери",
  },
];

export default function Reviews() {
  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 sm:mb-14"
      >
        <p className="text-sm font-mono text-primary font-bold uppercase tracking-widest mb-2">
          Отзывы
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
          Что говорят клиенты
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Реальные отзывы от жителей Саратова, которые уже доверили нам свой ремонт.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {REVIEWS.map((review, index) => (
          <ReviewCard key={index} review={review} index={index} />
        ))}
      </div>
    </div>
  );
}
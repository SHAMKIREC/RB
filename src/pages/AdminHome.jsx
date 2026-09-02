import { Link } from 'react-router-dom';
import {
  BadgeRussianRuble,
  Camera,
  DatabaseBackup,
  FolderKanban,
  KeyRound,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import AdminGate from '../components/AdminGate';
import { enableInlineEditMode } from '../lib/pricingStorage';

const sections = [
  {
    to: '/admin/orders',
    title: 'Управление заказами',
    description: 'Создание, публикация и закрытие заказов.',
    icon: ReceiptText,
    primary: true,
  },
  {
    to: '/admin/rb-pro',
    title: 'Доступ RB PRO',
    description: 'Коды доступа мастеров и подключённые устройства.',
    icon: KeyRound,
  },
  {
    to: '/admin/projects',
    title: 'Проекты',
    description: 'Выполненные работы, фотографии и документы.',
    icon: FolderKanban,
  },
  {
    to: '/admin/reviews',
    title: 'Отзывы',
    description: 'Добавление и публикация отзывов клиентов.',
    icon: MessageSquareText,
  },
  {
    to: '/admin/service-photos',
    title: 'Фото услуг',
    description: 'Фотографии для карточек строительных услуг.',
    icon: Camera,
  },
  {
    to: '/admin/backup',
    title: 'Резервная копия',
    description: 'Сохранение и восстановление данных сайта.',
    icon: DatabaseBackup,
  },
];

function Dashboard() {
  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="relative overflow-hidden rounded-[28px] border border-orange-400/25 bg-gradient-to-br from-[#302925] via-[#242321] to-[#1d1c1b] p-5 text-white shadow-[0_24px_60px_-35px_rgba(0,0,0,.9)] sm:p-8">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-orange-300">Решаем Быстро</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Панель владельца</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">Выберите, чем хотите управлять. Заказы теперь открываются отдельной кнопкой и больше не заменяют главную страницу админки.</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ to, title, description, icon: Icon, primary }) => (
          <Link
            key={to}
            to={to}
            className={`group flex min-h-[138px] flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${primary ? 'border-orange-400/50 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20' : 'border-border bg-card text-foreground hover:border-primary/45'}`}
          >
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${primary ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-black">{title}</h2>
            <p className={`mt-1 text-sm leading-relaxed ${primary ? 'text-white/75' : 'text-muted-foreground'}`}>{description}</p>
          </Link>
        ))}

        <Link
          to="/services"
          onClick={enableInlineEditMode}
          className="group flex min-h-[138px] flex-col rounded-2xl border border-orange-400/35 bg-orange-500/10 p-5 text-foreground transition-all duration-200 hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-xl"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500/15 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white dark:text-orange-300">
            <BadgeRussianRuble className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-base font-black">Цены услуг</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Открыть сайт в режиме изменения цен.</p>
        </Link>
      </div>
    </div>
  );
}

export default function AdminHome() {
  return (
    <AdminGate>
      <Dashboard />
    </AdminGate>
  );
}

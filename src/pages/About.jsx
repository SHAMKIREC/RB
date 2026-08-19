import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calculator, Check, Clock3, FileText, Hammer, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { TelegramIcon, WhatsAppIcon } from "../components/SocialLinks";
import { CITY, PHONE, PHONE_DISPLAY } from "../lib/calcData";

const CONTACTS = [
  { label: "WhatsApp", href: "https://wa.me/79878377006", icon: WhatsAppIcon, color: "bg-[#25D366]" },
  { label: "Telegram", href: "https://t.me/+79063052828", icon: TelegramIcon, color: "bg-[#229ED9]" },
];

const DIRECTIONS = [
  { icon: Hammer, title: "Ремонт и строительство", text: "От демонтажа и черновых работ до чистовой отделки и готового результата.", items: ["Ремонт квартир", "Отделочные работы", "Строительные работы"] },
  { icon: FileText, title: "Строительная документация", text: "Подготавливаем документы понятно, аккуратно и с учётом особенностей объекта.", items: ["ППР и технологические карты", "Сметы", "ПОС / ПОР"] },
];

const STEPS = ["Получаем задачу", "Изучаем объект и материалы", "Согласовываем стоимость", "Выполняем работу", "Передаём результат"];

export default function About() {
  return (
    <div className="pb-10 sm:pb-14">
      <section className="relative overflow-hidden bg-[#242321] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,80,20,.28),transparent_34%),radial-gradient(circle_at_5%_90%,rgba(255,120,40,.13),transparent_35%)]" />
        <div className="page-shell relative py-10 sm:py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/35 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-orange-300"><Sparkles className="h-4 w-4" /> О компании</div>
            <h1 className="text-4xl font-black leading-[.98] sm:text-6xl lg:text-7xl">Не обещаем лишнего.<br /><span className="text-primary">Решаем быстро.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">Строительные услуги, ремонт и подготовка документации в Саратове. Берём задачу в работу, объясняем каждый этап и доводим до результата.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/calculator" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5"><Calculator className="h-5 w-5" /> Рассчитать стоимость <ArrowRight className="h-5 w-5" /></Link>
              <a href={`tel:${PHONE}`} className="sos-pulse inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-black text-white"><Phone className="h-5 w-5" /> SOS 24/7</a>
            </div>
          </motion.div>
          <div className="mt-10 grid grid-cols-3 gap-2 sm:max-w-2xl sm:gap-4">
            {[{ value: "24/7", label: "на связи", icon: Clock3 }, { value: "3 года", label: "гарантии", icon: ShieldCheck }, { value: "от 7 лет", label: "опыт мастеров", icon: BadgeCheck }].map(({ value, label, icon: Icon }) => <div key={value} className="rounded-2xl border border-white/10 bg-white/[.07] p-3 backdrop-blur sm:p-5"><Icon className="mb-3 h-5 w-5 text-primary" /><div className="text-lg font-black sm:text-2xl">{value}</div><div className="mt-1 text-[11px] text-white/55 sm:text-sm">{label}</div></div>)}
          </div>
        </div>
      </section>

      <div className="page-shell">
        <section className="py-10 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Чем занимаемся</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Два направления — один ответственный подход</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {DIRECTIONS.map(({ icon: Icon, title, text, items }, index) => <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }} className="rb-card rounded-3xl border-2 border-primary/55 bg-card p-6 shadow-sm sm:p-8"><div className="logo-gradient flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-orange-500/20"><Icon className="h-7 w-7 text-white" /></div><h3 className="mt-6 text-2xl font-black">{title}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{text}</p><ul className="mt-6 space-y-3">{items.map(item => <li key={item} className="flex items-center gap-3 font-semibold"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-4 w-4" /></span>{item}</li>)}</ul></motion.article>)}
          </div>
        </section>

        <section className="rounded-3xl bg-secondary/70 px-5 py-8 sm:px-8 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Как работаем</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Понятно на каждом этапе</h2>
          <div className="mt-7 grid gap-3 lg:grid-cols-5">{STEPS.map((step, index) => <div key={step} className="relative rounded-2xl border border-border bg-background p-5"><span className="font-mono text-sm font-black text-primary">0{index + 1}</span><h3 className="mt-8 font-black">{step}</h3>{index < STEPS.length - 1 && <ArrowRight className="absolute right-4 top-4 hidden h-4 w-4 text-primary/50 lg:block" />}</div>)}</div>
        </section>

        <section className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff6824] to-[#ff321e] p-6 text-white shadow-xl shadow-orange-500/15 sm:p-10">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><div className="flex items-center gap-2 text-sm font-bold text-white/80"><MapPin className="h-5 w-5" /> {CITY}, работаем 24/7</div><h2 className="mt-4 text-3xl font-black sm:text-5xl">Обсудим вашу задачу?</h2><p className="mt-3 max-w-xl text-white/80">Позвоните или напишите — уточним детали и подскажем, с чего начать.</p></div><div className="flex flex-wrap gap-3">{CONTACTS.map(({ label, href, icon: Icon, color }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 ${color}`}><Icon size={20} />{label}</a>)}<a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/15 px-4 py-3 font-black"><Phone className="h-4 w-4" />{PHONE_DISPLAY}</a></div></div>
        </section>
      </div>
    </div>
  );
}

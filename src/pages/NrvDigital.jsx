import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NRV_DIGITAL_CONTACTS } from '../data/nrvDigitalContacts';
import { NRV_DIGITAL_PROJECTS } from '../data/nrvDigitalProjects';
import { MaxIcon, TelegramIcon, VKIcon, WhatsAppIcon } from '../components/SocialLinks';

const CONTACT_ICONS = { telegram: TelegramIcon, whatsapp: WhatsAppIcon, max: MaxIcon, vk: VKIcon };
const CONTACT_CARDS = [
  { label: 'Telegram', description: 'Написать партнёру', href: NRV_DIGITAL_CONTACTS.telegramUrl, icon: 'telegram' },
  { label: 'WhatsApp', description: 'Написать партнёру', href: NRV_DIGITAL_CONTACTS.whatsappUrl, icon: 'whatsapp' },
  { label: 'MAX', description: 'Связаться с партнёром', href: NRV_DIGITAL_CONTACTS.maxUrl, icon: 'max' },
  { label: 'VK', description: 'Открыть профиль партнёра', href: NRV_DIGITAL_CONTACTS.vkUrl, icon: 'vk' },
];

function BackToConstructionSite() {
  return <Link to="/" className="group inline-flex items-center gap-2 rounded-xl border border-primary/65 bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(234,88,12,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_16px_30px_-14px_rgba(234,88,12,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />Вернуться на сайт «Решаем Быстро»</Link>;
}

export default function NrvDigital() {
  return (
    <div className="page-shell py-6 sm:py-8">
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="rb-card rounded-3xl border-2 border-primary/70 bg-card px-6 py-7 shadow-[0_20px_44px_-28px_rgba(15,23,42,0.4),0_6px_18px_-14px_rgba(234,88,12,0.22)] sm:px-8 sm:py-9">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-primary">Цифровой партнёр «РБ Решаем Быстро»</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-5xl">NRV DIGITAL</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">NRV DIGITAL — независимый цифровой партнёр «РБ Решаем Быстро» по разработке сайтов, веб-приложений, онлайн-калькуляторов, автоматизации и технической поддержке цифровых сервисов.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold sm:text-sm">
          {['Сайты', 'Веб-приложения', 'Автоматизация', 'Калькуляторы', 'Поддержка'].map((item) => <span key={item} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-foreground">{item}</span>)}
        </div>
      </motion.section>

      <motion.section id="contacts" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="scroll-mt-24 py-7 sm:py-8">
        <div className="rb-card rounded-3xl border border-primary/45 bg-card p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.55),0_8px_20px_-18px_rgba(234,88,12,0.3)] sm:p-7">
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">Связаться с партнёром</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Контакты NRV DIGITAL. Обращение идёт напрямую партнёру и не является заявкой в «РБ Решаем Быстро».</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CONTACT_CARDS.map(({ label, description, href, icon }) => {
              const Icon = CONTACT_ICONS[icon];
              const content = <><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-[0_7px_16px_-11px_rgba(234,88,12,0.8)] transition-all duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:shadow-[0_10px_20px_-10px_rgba(234,88,12,0.9)]"><Icon size={27} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-black text-foreground">{label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{description}</span></span>{href && <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />}</>;
              const className = `group flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.55)] ${href ? 'transition-all duration-200 hover:-translate-y-1 hover:border-primary/70 hover:bg-primary/5 hover:shadow-[0_20px_30px_-18px_rgba(234,88,12,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2' : 'cursor-default opacity-70'}`;

              return href ? <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a> : <div key={label} aria-disabled="true" className={className}>{content}</div>;
            })}
          </div>
          <div className="mt-6"><BackToConstructionSite /></div>
        </div>
      </motion.section>

      <motion.section id="projects" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="scroll-mt-24 pb-7 pt-4 sm:pb-8 sm:pt-5">
        <h2 className="text-3xl font-black text-foreground sm:text-4xl">Проекты партнёра</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Примеры цифровых проектов NRV DIGITAL, которые можно открыть и посмотреть отдельно от строительного сайта.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NRV_DIGITAL_PROJECTS.map((project) => (
            <article key={project.title} className="group rb-card flex min-h-full flex-col overflow-hidden rounded-2xl border border-primary/35 bg-card shadow-[0_16px_28px_-24px_rgba(15,23,42,0.55)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_24px_36px_-22px_rgba(234,88,12,0.55)]">
              <div className={`overflow-hidden border-b border-primary/25 ${project.title === 'AcademicPro' ? 'aspect-[16/9]' : ''}`}><img src={project.image} alt={`Превью: ${project.title}`} className={`w-full object-cover transition-transform duration-500 ${project.title === 'AcademicPro' ? 'h-[150%] -translate-y-[33.333%] object-bottom' : 'aspect-[16/9] object-top group-hover:scale-[1.025]'}`} /></div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{project.type}</p>
                <h3 className="mt-2 text-xl font-black text-foreground">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="group/button mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/60 bg-background px-4 py-2.5 text-sm font-bold text-foreground shadow-[0_8px_18px_-15px_rgba(15,23,42,0.45)] transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-[0_14px_24px_-14px_rgba(234,88,12,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Открыть проект партнёра<ExternalLink className="h-4 w-4 text-primary transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 group-hover/button:text-white" /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6"><BackToConstructionSite /></div>
      </motion.section>
    </div>
  );
}

import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { DOCUMENTATION_SERVICES } from "../data/documentationServices";

const PREVIEW_SERVICES = [
  ...DOCUMENTATION_SERVICES.filter((service) => ["ppr", "tech-maps", "estimates"].includes(service.id)),
  {
    id: "pos-por",
    title: "ПОС / ПОР",
    description: "Организация строительства объекта и отдельных этапов работ.",
    price: "от 7 000 ₽",
  },
];

export default function DocumentationPreview() {
  return (
    <section className="page-shell py-6 sm:py-10">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end sm:gap-4">
        <div>
          <p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Строительная документация</p>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">Документы для строительных работ</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Разрабатываем ППР, технологические карты, сметы и другие документы для строительных работ.</p>
        </div>
        <Link to="/documentation" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-200 hover:gap-3">Перейти к документации <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {PREVIEW_SERVICES.map((service) => (
          <article key={service.id} className="rb-card flex h-[188px] min-w-0 flex-col overflow-hidden rounded-2xl border border-primary/60 bg-card p-3.5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.32),0_4px_12px_-10px_rgba(234,88,12,0.16)] sm:h-[220px] sm:rounded-3xl sm:border-2 sm:p-5">
            <div className="mb-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:mb-3 sm:h-10 sm:w-10 sm:rounded-xl"><FileText className="h-4 w-4 sm:h-5 sm:w-5" /></div>
            <h3 className="text-sm font-black leading-tight tracking-tight text-foreground sm:text-base">{service.title}</h3>
            <p className="mt-1.5 line-clamp-4 text-xs leading-[1.35] text-muted-foreground sm:mt-2 sm:text-sm sm:leading-snug">{service.description}</p>
            <p className="mt-auto pt-2 text-xs font-black text-primary sm:pt-3 sm:text-sm">{service.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

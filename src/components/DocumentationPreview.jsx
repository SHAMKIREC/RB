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
    <section className="page-shell py-8 sm:py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">Строительная документация</p>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">Документы для строительных работ</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Разрабатываем ППР, технологические карты, сметы и другие документы для строительных работ.</p>
        </div>
        <Link to="/documentation" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-200 hover:gap-3">Перейти к документации <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW_SERVICES.map((service) => (
          <Link to="/documentation" key={service.id} className="rb-card group flex h-full flex-col rounded-3xl border-2 border-primary/70 bg-card p-5 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.34),0_5px_14px_-11px_rgba(234,88,12,0.18)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-[0_22px_44px_-26px_rgba(15,23,42,0.42),0_10px_20px_-14px_rgba(234,88,12,0.28)]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm shadow-primary/10 transition-transform duration-200 group-hover:scale-105"><FileText className="h-5 w-5" /></div>
            <h3 className="text-base font-black tracking-tight text-foreground">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            <p className="mt-auto pt-4 text-sm font-black text-primary">{service.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MessageCircle, Calculator } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  PRICE_LIST,
  CATEGORY_PRICE_MAP,
  PHONE_NUMBER,
  VK_URL,
} from "../lib/servicesData";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = SERVICE_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Категория не найдена</h1>
        <Link to="/services" className="text-primary mt-4 inline-block">← Назад к услугам</Link>
      </div>
    );
  }

  const priceKeys = CATEGORY_PRICE_MAP[slug] || [];
  const priceSections = priceKeys.map((key) => PRICE_LIST[key]).filter(Boolean);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Все услуги
      </Link>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden mb-10 sm:mb-14 shadow-xl"
      >
        <div className="relative aspect-[21/8] sm:aspect-[3/1]">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-14">
            <div>
              <p className="text-sm font-mono font-bold uppercase tracking-widest text-orange-400 mb-2">
                {category.priceFrom}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-3">
                {category.name}
              </h1>
              <p className="text-white/80 max-w-lg text-sm sm:text-base">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Price tables */}
      {priceSections.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Расценки</h2>
          <div className="space-y-4">
            {priceSections.map((section, si) => (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.1 }}
                className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm"
              >
                <div className="px-5 py-4 bg-secondary/50 border-b border-border">
                  <h3 className="font-bold text-foreground">{section.name}</h3>
                </div>
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-secondary/30 ${
                      idx !== section.items.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="font-mono font-bold text-primary text-sm whitespace-nowrap ml-4">
                      {item.price.toLocaleString("ru-RU")} ₽
                      <span className="text-muted-foreground font-normal"> / {item.unit}</span>
                    </span>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden border border-border rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 p-6 sm:p-10 text-center"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 relative">
          Нужна эта услуга?
        </h3>
        <p className="text-muted-foreground mb-7 relative">
          Позвоните или напишите — рассчитаем стоимость бесплатно
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative">
          <a
            href={PHONE_NUMBER}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-sm w-full sm:w-auto shadow-lg shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4" />
            Позвонить
          </a>
          <a
            href={VK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0077FF] text-white rounded-2xl font-bold text-sm w-full sm:w-auto shadow-lg shadow-[#0077FF]/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M21.579 6.855c.14-.465 0-.806-.662-.806h-2.193c-.558 0-.813.295-.953.619 0 0-1.114 2.713-2.693 4.476-.511.513-.743.676-1.022.676-.139 0-.341-.163-.341-.628V6.855c0-.558-.161-.806-.626-.806H9.642c-.348 0-.558.258-.558.504 0 .528.79.65.871 2.138v3.228c0 .707-.128.836-.407.836-.743 0-2.551-2.725-3.621-5.843-.21-.605-.421-.85-.982-.85H2.752c-.627 0-.752.295-.752.619 0 .58.743 3.452 3.461 7.254 1.812 2.601 4.363 4.011 6.687 4.011 1.393 0 1.565-.313 1.565-.852v-1.966c0-.626.133-.752.574-.752.325 0 .883.163 2.184 1.417 1.486 1.486 1.732 2.153 2.567 2.153h2.192c.626 0 .939-.313.759-.931-.197-.615-.907-1.51-1.849-2.569-.512-.604-1.277-1.254-1.51-1.579-.325-.419-.232-.604 0-.976.001 0 2.672-3.759 2.949-5.036z"/>
            </svg>
            Написать в ВК
          </a>
          <Link
            to="/calculator"
            className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-border bg-background text-foreground rounded-2xl font-bold text-sm w-full sm:w-auto hover:bg-secondary active:scale-95 transition-all"
          >
            <Calculator className="w-4 h-4" />
            Калькулятор
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
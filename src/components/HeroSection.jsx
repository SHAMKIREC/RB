import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { PHONE_NUMBER } from "../lib/servicesData";
import { PHONE_DISPLAY } from "../lib/calcData";
import HeroBrushAnimation from './hero/HeroBrushAnimation';

const HERO_IMAGE = "/assets/hero-image.png";

export default function HeroSection() {
  const [desktopSosOpen, setDesktopSosOpen] = useState(false);

  return (
    <section className="relative flex min-h-[350px] items-center overflow-hidden sm:min-h-[368px] xl:min-h-[66vh]">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Ремонт квартиры и строительные работы"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </div>

      <HeroBrushAnimation />

      <div className="page-shell relative top-6 z-10 max-w-[1440px] sm:top-0">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative -top-8 left-1 z-20 mb-6 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 sm:left-0 sm:top-0 sm:gap-2 sm:px-4 sm:py-2"
          >
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary sm:h-2 sm:w-2" />
            <span className="whitespace-nowrap text-[10px] font-semibold text-primary sm:text-sm">г. Саратов · Работаем 24/7</span>
          </motion.div>

          <h1 className="relative -top-8 mb-6 sm:top-0">
            <motion.div
              initial={{ x: -80, opacity: 0, filter: "blur(8px)", rotate: -2 }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-black leading-none tracking-tight text-foreground min-[375px]:text-5xl sm:text-6xl lg:text-8xl"
            >
              РЕШАЕМ
            </motion.div>
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.45, type: "spring", stiffness: 90, damping: 14 }}
              className="text-4xl font-black leading-none tracking-tight min-[375px]:text-5xl sm:text-6xl lg:text-8xl"
              style={{ WebkitTextStroke: "2px", background: "linear-gradient(135deg, #FF6B35, #FF3300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              БЫСТРО
            </motion.div>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="relative -top-8 mb-7 sm:top-0 sm:mb-10"
          >
            <span className="text-xl font-bold text-foreground dark:text-white sm:text-2xl">Строим будущее </span>
            <span className="text-xl font-bold sm:text-2xl" style={{ color: "#FF6B35" }}>—</span>
            <span className="text-xl font-bold text-foreground dark:text-white sm:text-2xl"> ремонтируем настоящее!</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="relative -top-8 z-30 flex flex-row gap-3 sm:top-0"
          >
            <Link
              to="/services"
              className="group inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl logo-gradient px-3 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:opacity-90 active:scale-95 sm:flex-none sm:gap-3 sm:px-8 sm:text-base"
            >
              Узнать условия
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setDesktopSosOpen((open) => !open)}
              aria-label={desktopSosOpen ? `Телефон ${PHONE_DISPLAY}` : "Показать номер SOS 24/7"}
              title={desktopSosOpen ? PHONE_DISPLAY : "Показать номер телефона"}
              className="sos-pulse relative z-30 hidden min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-primary px-3 py-4 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95 sm:flex-none sm:gap-3 sm:px-8 sm:text-base min-[900px]:inline-flex"
            >
              <Phone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              {desktopSosOpen ? PHONE_DISPLAY : "SOS 24/7"}
            </button>

            <a
              href={PHONE_NUMBER}
              aria-label="Позвонить в Решаем быстро, срочный вызов 24/7"
              title={`Позвонить: ${PHONE_DISPLAY}`}
              className="sos-pulse relative z-30 inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-primary px-3 py-4 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95 sm:flex-none sm:gap-3 sm:px-8 sm:text-base min-[900px]:hidden"
            >
              <Phone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              SOS 24/7
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

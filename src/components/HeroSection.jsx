import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { PHONE_NUMBER } from "../lib/servicesData";
import HeroBrushAnimation from './hero/HeroBrushAnimation';

const HERO_IMAGE = "/assets/hero-image.png";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[350px] items-center overflow-hidden sm:min-h-[368px] xl:min-h-[66vh]">
      {/* Hero image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Премиальный ремонт"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </div>

      <HeroBrushAnimation />

      {/* Content */}
      <div className="page-shell relative top-6 z-10 sm:top-0">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative -top-8 left-1 z-20 mb-6 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 sm:top-0 sm:left-0 sm:gap-2 sm:px-4 sm:py-2"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse sm:h-2 sm:w-2" />
            <span className="whitespace-nowrap text-[10px] font-semibold text-primary sm:text-sm">г. Саратов · Работаем 24/7</span>
          </motion.div>

          {/* Title */}
          <h1 className="relative -top-8 mb-6 sm:top-0">
            <motion.div
              initial={{ x: -80, opacity: 0, filter: "blur(8px)", rotate: -2 }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl min-[375px]:text-5xl sm:text-6xl lg:text-8xl font-black text-foreground leading-none tracking-tight"
            >
              РЕШАЕМ
            </motion.div>
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.45, type: "spring", stiffness: 90, damping: 14 }}
              className="text-4xl min-[375px]:text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight"
              style={{ WebkitTextStroke: "2px", background: "linear-gradient(135deg, #FF6B35, #FF3300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              БЫСТРО
            </motion.div>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="relative -top-8 mb-7 sm:top-0 sm:mb-10"
          >
            <span className="text-xl sm:text-2xl font-bold text-foreground dark:text-white">Строим будущее </span>
            <span className="text-xl sm:text-2xl font-bold" style={{ color: "#FF6B35" }}>—</span>
            <span className="text-xl sm:text-2xl font-bold text-foreground dark:text-white"> ремонтируем настоящее!</span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="relative -top-8 flex flex-row gap-3 sm:top-0"
          >
            <Link
              to="/services"
              className="group inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl logo-gradient px-3 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:opacity-90 active:scale-95 sm:flex-none sm:gap-3 sm:px-8 sm:text-base"
            >
              Узнать условия
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Link>
            <a
              href={PHONE_NUMBER}
              className="sos-pulse inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-primary px-3 py-4 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95 sm:flex-none sm:gap-3 sm:px-8 sm:text-base"
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

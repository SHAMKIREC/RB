import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, ChevronDown, Star } from "lucide-react";
import { PHONE_NUMBER, VK_URL } from "../lib/servicesData";

const HERO_IMAGE = "https://media.base44.com/images/public/69cbd0280d63703e9c98400e/d3c5e25af_generated_image.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Hero image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Премиальный ремонт"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">г. Саратов · Работаем 24/7</span>
          </motion.div>

          {/* Title */}
          <h1 className="mb-6">
            <motion.div
              initial={{ x: -80, opacity: 0, filter: "blur(8px)", rotate: -2 }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black text-foreground leading-none tracking-tight"
            >
              РЕШАЕМ
            </motion.div>
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.45, type: "spring", stiffness: 90, damping: 14 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight"
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
            className="mb-10"
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
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 logo-gradient text-white rounded-2xl font-bold text-base shadow-xl shadow-orange-500/25 hover:opacity-90 active:scale-95 transition-all"
            >
              Узнать условия
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={PHONE_NUMBER}
              className="sos-pulse inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary text-primary rounded-2xl font-bold text-base hover:bg-primary/5 active:scale-95 transition-all"
            >
              <Phone className="w-5 h-5" />
              SOS 24/7
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              <span className="text-sm text-muted-foreground ml-1">4.9 на Яндексе</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">500+</span> выполненных объектов
            </div>
            <div className="text-sm text-muted-foreground">
              Гарантия <span className="font-bold text-foreground">3 года</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-xs">Прокрутите вниз</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
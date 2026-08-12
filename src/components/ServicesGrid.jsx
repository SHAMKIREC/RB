import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES } from "../lib/servicesData";
import { ArrowRight } from "lucide-react";

export default function ServicesGrid() {
  const homeServices = SERVICE_CATEGORIES.filter((service) => service.showOnHome !== false);

  return (
    <section className="page-shell pt-6 pb-6 sm:pt-10 sm:pb-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">Наши услуги</h2>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm"
        >
          Все услуги <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {homeServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
          >
            <Link
              to={`/services?category=${service.slug}`}
              className="rb-card rb-card-action group block relative overflow-hidden rounded-2xl border-2 border-primary/70"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="600"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg">
                  <span className="text-xs font-mono font-bold text-primary">{service.priceFrom}</span>
                </div>
              </div>
              {/* Text */}
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

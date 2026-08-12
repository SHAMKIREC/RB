import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link
        to={`/services?category=${service.slug}`}
        className="rb-card rb-card-action group block relative overflow-hidden rounded-2xl border-2 border-primary/70"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={service.image}
            alt={service.imageAlt}
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg border border-white/20">
            <span className="text-xs font-mono font-bold text-primary">{service.priceFrom}</span>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors flex-shrink-0">
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

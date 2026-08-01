import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { VK_URL } from "../lib/servicesData";

export default function VkBanner() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.a
        href={VK_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.5 }}
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}
        className="group flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 transition-all cursor-pointer"
      >
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(59,130,246,0.15), rgba(147,51,234,0.15))", filter: "blur(40px)", opacity: 0.6, pointerEvents: "none" }} />
        {/* VK icon big */}
        <div className="w-16 h-16 rounded-2xl bg-[#0077FF] flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
            <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z"/>
          </svg>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-black text-foreground mb-1">Наша группа ВКонтакте</h3>
          <p className="text-muted-foreground text-sm">
            Смотрите портфолио, отзывы клиентов и актуальные акции прямо в нашей группе ВК
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm flex-shrink-0 text-white group-hover:bg-white/20 transition-all">
          Открыть группу
          <ExternalLink className="w-4 h-4" />
        </div>
      </motion.a>
    </section>
  );
}
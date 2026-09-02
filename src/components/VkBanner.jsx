import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { VK_URL } from "../lib/servicesData";

export default function VkBanner() {
  return (
    <section className="page-shell pt-6 pb-10 sm:pt-8 sm:pb-12">
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
        className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-7 lg:min-h-[150px] lg:px-9 lg:py-8 transition-all cursor-pointer"
      >
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(59,130,246,0.15), rgba(147,51,234,0.15))", filter: "blur(40px)", opacity: 0.6, pointerEvents: "none" }} />
        {/* VK icon big */}
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-[22px] bg-[#0077FF] flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <svg className="w-8 h-8 lg:w-10 lg:h-10 fill-white" viewBox="0 0 24 24">
            <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z"/>
          </svg>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl lg:text-2xl font-black text-foreground mb-1 lg:mb-2">Наша группа ВКонтакте</h3>
          <p className="text-muted-foreground text-sm lg:text-base lg:leading-relaxed max-w-3xl">
            Смотрите портфолио, отзывы клиентов и актуальные акции прямо в нашей группе ВК
          </p>
        </div>
        <div className="flex items-center gap-2 lg:gap-2.5 rounded-xl lg:rounded-2xl bg-[#0077FF] px-6 py-3 lg:px-7 lg:py-4 font-bold text-sm lg:text-base text-white shadow-md shadow-blue-500/25 transition-all group-hover:bg-[#0069e0] group-focus-visible:ring-2 group-focus-visible:ring-[#0077FF] group-focus-visible:ring-offset-2 flex-shrink-0">
          Открыть группу
          <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5" />
        </div>
      </motion.a>
    </section>
  );
}

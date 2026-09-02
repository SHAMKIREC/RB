import { motion, useReducedMotion } from "framer-motion";
import { Shield, Clock, Wrench, ThumbsUp } from "lucide-react";

const ITEMS = [
  { icon: Clock, title: "Срочный выезд", desc: "Приедем в течение 2 часов после звонка в любой день недели" },
  { icon: Shield, title: "Гарантия 3 года", desc: "На все виды работ. Устраним недостатки бесплатно" },
  { icon: Wrench, title: "Опытные мастера", desc: "Профессионалы с опытом от 7 лет, без субподряда" },
  { icon: ThumbsUp, title: "Честные цены", desc: "Фиксированная смета без скрытых доплат в процессе работы" },
];

export default function WhyUs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden border-y border-border bg-secondary/50 pb-4 pt-7 sm:pb-4 sm:pt-10">
      <div className="page-shell max-w-[1440px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-center sm:mb-8">
          <h2 className="text-4xl font-black leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">Наши преимущества</h2>
        </motion.div>
        <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`rb-card rb-card-action relative flex h-[205px] min-w-0 flex-col overflow-hidden rounded-2xl p-3.5 sm:h-[220px] sm:p-5 ${i === 0 ? "sos-card-heartbeat border-primary/70" : ""}`}>
                <div className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg logo-gradient shadow-md shadow-orange-500/20 sm:h-12 sm:w-12 sm:rounded-xl">
                  <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                {i === 0 && <motion.span animate={shouldReduceMotion ? undefined : { scale: [1, 1.13, 1, 1.2, 1, 1] }} transition={shouldReduceMotion ? undefined : { duration: 1.65, times: [0, 0.08, 0.15, 0.23, 0.31, 1], ease: "easeInOut", repeat: Infinity }} className="absolute right-3 top-3 bg-gradient-to-br from-[#FF6B35] to-[#FF3300] bg-clip-text text-[21px] font-black leading-none tracking-tight text-transparent drop-shadow-[0_5px_11px_rgba(255,80,0,0.34)] sm:right-5 sm:top-5 sm:text-[30px]">24/7</motion.span>}
                <h3 className="mb-1.5 max-w-[170px] text-[17px] font-bold leading-[1.2] text-foreground sm:text-xl">{item.title}</h3>
                <p className="text-[14px] leading-[1.4] text-muted-foreground sm:text-base sm:leading-[1.45]">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

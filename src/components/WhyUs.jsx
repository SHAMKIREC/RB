import { motion } from "framer-motion";
import { Shield, Clock, Wrench, ThumbsUp } from "lucide-react";

const ITEMS = [
  { icon: Clock, title: "Срочный выезд", desc: "Приедем в течение 2 часов после звонка в любой день недели" },
  { icon: Shield, title: "Гарантия 3 года", desc: "На все виды работ. Устраним недостатки бесплатно" },
  { icon: Wrench, title: "Опытные мастера", desc: "Профессионалы с опытом от 7 лет, без субподряда" },
  { icon: ThumbsUp, title: "Честные цены", desc: "Фиксированная смета без скрытых доплат в процессе работы" },
];

export default function WhyUs() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2 font-mono">Почему мы</p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">Наши преимущества</h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-5 sm:p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl logo-gradient flex items-center justify-center mb-4 shadow-md shadow-orange-500/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
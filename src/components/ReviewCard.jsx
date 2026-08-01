import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="premium-card border border-border rounded-2xl bg-card p-5 sm:p-6 shadow-sm"
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? "text-orange-400 fill-orange-400" : "text-border"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-4">{review.text}</p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-sm">{review.name.charAt(0)}</span>
        </div>
        <div>
          <div className="font-bold text-foreground text-sm">{review.name}</div>
          <div className="text-xs text-muted-foreground">{review.date}</div>
        </div>
        {review.work && (
          <div className="ml-auto px-3 py-1 bg-secondary rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">{review.work}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
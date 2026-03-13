import { motion } from "framer-motion";

export function InsightCard({ emoji, text, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all"
    >
      <span className="text-lg flex-shrink-0 mt-0.5">{emoji}</span>
      <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
    </motion.div>
  );
}

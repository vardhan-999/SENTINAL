import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function ExerciseCounterCard({ name, icon: Icon, target, completed, color = "blue" }) {
  const pct = Math.min((completed / target) * 100, 100);
  const done = completed >= target;

  const colorMap = {
    blue:   { text: "text-blue-400",   bar: "from-blue-500 to-cyan-400",   bg: "bg-blue-500/10",   border: "border-blue-500/25",  glow: "rgba(59,130,246,0.3)" },
    violet: { text: "text-violet-400", bar: "from-violet-500 to-purple-400", bg: "bg-violet-500/10", border: "border-violet-500/25", glow: "rgba(139,92,246,0.3)" },
    emerald:{ text: "text-emerald-400",bar: "from-emerald-500 to-teal-400", bg: "bg-emerald-500/10",border: "border-emerald-500/25",glow: "rgba(52,211,153,0.3)" },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border ${c.bg} ${c.border} flex flex-col gap-4 relative overflow-hidden transition-all`}
      style={{ boxShadow: done ? `0 0 25px ${c.glow}` : "none" }}
    >
      {done && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-xs text-gray-500">Target: {target} reps</p>
        </div>
      </div>

      {/* Big count display */}
      <div className="flex items-end gap-2">
        <motion.span
          key={completed}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className={`text-5xl font-black tabular-nums ${done ? "text-emerald-400" : c.text}`}
        >
          {Math.min(completed, target)}
        </motion.span>
        <span className="text-xl text-gray-500 font-bold mb-1">/ {target}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold text-emerald-400 text-center"
        >
          ✓ Complete!
        </motion.p>
      )}
    </motion.div>
  );
}

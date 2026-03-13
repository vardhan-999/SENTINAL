import { motion } from "framer-motion";
import { Eye, Activity, Gamepad2 } from "lucide-react";

const STATS = [
  { icon: Eye,       label: "Drowsiness Events Detected", value: 3, color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20"    },
  { icon: Activity,  label: "Exercise Sessions Triggered", value: 2, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  { icon: Gamepad2,  label: "Alertness Games Played",      value: 1, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
];

export function DrowsinessStatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
    >
      <h3 className="text-sm font-bold text-white mb-4">🛡️ Drowsiness Analysis</h3>
      <div className="flex flex-col gap-3">
        {STATS.map((s, i) => (
          <div key={i} className={`flex items-center gap-4 ${s.bg} ${s.border} border rounded-xl px-4 py-3`}>
            <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.border} border flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <span className="text-xs text-gray-300 flex-1">{s.label}</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.4, type: "spring", stiffness: 300 }}
              className={`text-2xl font-black ${s.color}`}
            >
              {s.value}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

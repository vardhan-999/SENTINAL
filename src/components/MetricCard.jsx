import { motion } from "framer-motion";

export function MetricCard({ icon: Icon, value, label, color = "indigo", delay = 0 }) {
  const colorMap = {
    indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  icon: "text-indigo-400",  glow: "hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]"  },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400", glow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.2)]"  },
    amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   icon: "text-amber-400",   glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]"  },
    red:     { bg: "bg-red-500/10",     border: "border-red-500/20",     icon: "text-red-400",     glow: "hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]"   },
    blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    icon: "text-blue-400",    glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"  },
  };
  const c = colorMap[color] ?? colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`glass-card rounded-2xl p-5 border ${c.border} ${c.bg} transition-all ${c.glow} flex flex-col gap-3`}
    >
      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

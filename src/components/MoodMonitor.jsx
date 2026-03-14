import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, BatteryFull, Minus, Moon, Zap } from "lucide-react";
import { useFocus } from "../utils/FocusContext";

const MOODS = [
  {
    id: "focused",
    label: "Focused",
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]",
    suggestion: "You're in the zone! Study for 30 minutes.",
    duration: 30,
  },
  {
    id: "neutral",
    label: "Neutral",
    icon: Minus,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.2)]",
    suggestion: "Steady state. Study for 25 minutes.",
    duration: 25,
  },
  {
    id: "tired",
    label: "Tired",
    icon: BatteryFull,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.2)]",
    suggestion: "Study 15 min, then rest 5 min.",
    duration: 15,
  },
  {
    id: "drowsy",
    label: "Drowsy",
    icon: Moon,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.2)]",
    suggestion: "Take a 10-minute break first.",
    duration: 10,
  },
];

export function MoodMonitor({ onDurationChange }) {
  const { mood, updateMood } = useFocus();
  const activeMood = MOODS.find(m => m.id === mood) || MOODS[1];

  useEffect(() => {
    onDurationChange?.(activeMood.duration);
  }, [mood, activeMood.duration, onDurationChange]);

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/5 bg-white/[0.02] flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-indigo-400" />
        <h2 className="text-sm font-bold text-white">Cognitive State Monitor</h2>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 gap-2">
        {MOODS.map((m) => {
          const isActive = mood === m.id;
          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => updateMood(m.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${isActive ? `${m.bg} ${m.border} ${m.glow}` : "border-white/5 bg-white/[0.01] hover:bg-white/5"}`}
            >
              <m.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? m.color : "text-gray-500"}`} />
              <span className={`text-xs font-semibold ${isActive ? m.color : "text-gray-400"}`}>{m.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Suggestion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMood.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className={`rounded-xl p-3.5 ${activeMood.bg} border ${activeMood.border}`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className={`text-xs font-semibold ${activeMood.color}`}>AI Suggestion</p>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Live Detection</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{activeMood.suggestion}</p>
          <p className="text-[11px] text-gray-500 mt-1.5">Recommended timer: <span className={`font-bold ${activeMood.color}`}>{activeMood.duration} min</span></p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, BookOpen, CheckSquare, Sparkles, RotateCcw, LayoutDashboard } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { FocusTrendChart } from "../components/FocusTrendChart";
import { SessionPieChart } from "../components/SessionPieChart";
import { TaskCompletionChart } from "../components/TaskCompletionChart";
import { DrowsinessStatsCard } from "../components/DrowsinessStatsCard";

const METRICS = [
  { icon: Clock,         value: "2h 15m", label: "Total Focus Time",     color: "indigo",  delay: 0    },
  { icon: AlertTriangle, value: "3",      label: "Drowsiness Events",    color: "red",     delay: 0.07 },
  { icon: BookOpen,      value: "5",      label: "Topics Completed",     color: "emerald", delay: 0.14 },
  { icon: CheckSquare,   value: "7 / 10", label: "Tasks Completed",      color: "amber",   delay: 0.21 },
];

function getAIInsight(focus) {
  if (focus >= 80) return { emoji: "🔥", msg: "Excellent focus — great productivity this session!", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (focus >= 60) return { emoji: "👍", msg: "Good effort — try shorter breaks to maintain focus.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/25" };
  return { emoji: "💡", msg: "Focus dropped several times — consider shorter study intervals.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/25" };
}

export function SessionInsights() {
  const navigate = useNavigate();
  const avgFocus = 74; // Mock average — will come from real FocusBar data in production
  const insight = getAIInsight(avgFocus);

  return (
    <div className="h-full w-full max-w-6xl mx-auto flex flex-col gap-6">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Session Complete
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Session Insights</h1>
        <p className="text-sm text-gray-400 mt-1">Here's how your focus session went.</p>
        <p className="text-xs text-gray-600 mt-0.5">Reflect on your progress and improve your next session.</p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </motion.div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* ── AI Insight Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${insight.bg}`}
      >
        <span className="text-2xl flex-shrink-0">{insight.emoji}</span>
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">AI Insight</p>
          <p className={`text-sm font-semibold ${insight.color}`}>{insight.msg}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
          <span className="text-xs text-gray-400">Avg Focus</span>
          <span className={`text-base font-black ${insight.color}`}>{avgFocus}%</span>
        </div>
      </motion.div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Focus Trend - wide */}
        <div className="lg:col-span-2">
          <FocusTrendChart />
        </div>

        {/* Pie + Bar side-by-side */}
        <SessionPieChart />
        <TaskCompletionChart />

        {/* Drowsiness stats full-width on small, half on large */}
        <div className="lg:col-span-2">
          <DrowsinessStatsCard />
        </div>
      </div>

      {/* ── Bottom Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center pb-4"
      >
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/study")}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_40px_rgba(79,70,229,0.55)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Session
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          Return to Dashboard
        </motion.button>
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[25%] h-[25%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

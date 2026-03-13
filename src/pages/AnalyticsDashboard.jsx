import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock, LayoutDashboard, Target, BookOpen,
  AlertTriangle, Activity, Sparkles, RotateCcw, Brain
} from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { FocusConsistencyChart } from "../components/FocusConsistencyChart";
import { StudyTimeBarChart } from "../components/StudyTimeBarChart";
import { SessionPieChart } from "../components/SessionPieChart";
import { SubjectStudyChart } from "../components/SubjectStudyChart";
import { StudyHeatmap } from "../components/StudyHeatmap";
import { InsightCard } from "../components/InsightCard";

const METRICS = [
  { icon: Clock,         value: "42h 30m", label: "Total Study Time",             color: "indigo",  delay: 0     },
  { icon: LayoutDashboard,value: "18",     label: "Sessions Completed",           color: "blue",    delay: 0.06  },
  { icon: Target,        value: "82%",     label: "Average Focus Score",          color: "emerald", delay: 0.12  },
  { icon: BookOpen,      value: "67",      label: "Topics Completed",             color: "amber",   delay: 0.18  },
  { icon: AlertTriangle, value: "21",      label: "Drowsiness Events",            color: "red",     delay: 0.24  },
  { icon: Activity,      value: "14",      label: "Recovery Sessions Completed",  color: "blue",    delay: 0.30  },
];

const AI_INSIGHTS = [
  { emoji: "🌅", text: "You focus best during morning sessions — your average focus is 12% higher before noon." },
  { emoji: "⏱️", text: "Your longest unbroken focus streak was 42 minutes during Session 9." },
  { emoji: "💪", text: "Exercise recovery has improved your post-break focus score by an average of 12%." },
  { emoji: "📅", text: "Friday is your most productive day — averaging 5 hours of deep study per week." },
  { emoji: "🔄", text: "Sessions with Pomodoro timers under 30 minutes show 18% better task completion rates." },
];

export function AnalyticsDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-2 flex flex-col gap-6 pb-10">

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Long-Term Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Performance Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Your long-term study insights and productivity trends.</p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </motion.div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {METRICS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* ── Charts Row 1: Focus Trend (wide) ── */}
      <FocusConsistencyChart />

      {/* ── Charts Row 2: Bar + Pie ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StudyTimeBarChart />
        <SessionPieChart />
      </div>

      {/* ── Charts Row 3: Subjects + Heatmap ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubjectStudyChart />
        <StudyHeatmap />
      </div>

      {/* ── AI Insights Panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">AI Insights</h3>
          <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold ml-1">
            Personalised
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AI_INSIGHTS.map((ins, i) => (
            <InsightCard key={i} emoji={ins.emoji} text={ins.text} delay={i * 0.07 + 0.4} />
          ))}
        </div>
      </motion.div>

      {/* ── Action Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/study")}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_40px_rgba(79,70,229,0.55)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Start Study Session
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          Return to Home
        </motion.button>
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[5%] right-[5%] w-[35%] h-[35%] bg-indigo-600/4 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[30%] h-[30%] bg-purple-500/4 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

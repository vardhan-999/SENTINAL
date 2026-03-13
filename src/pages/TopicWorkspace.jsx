import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StickyNotesBoard } from "../components/StickyNotesBoard";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { StudyChatbot } from "../components/StudyChatbot";
import { YouTubeConceptSearch } from "../components/YouTubeConceptSearch";
import { CheckCircle2, Brain } from "lucide-react";

export function TopicWorkspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") || "Operating Systems – Process Scheduling";
  const subject = searchParams.get("subject") || "Operating Systems";

  const [completed, setCompleted] = useState(false);

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col gap-5">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="inline-block text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-2">{subject}</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{topic}</h1>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>

      {/* ── Main Two-Column Layout ── */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

        {/* LEFT: Sticky Notes Board */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full lg:w-[45%] min-h-[600px] flex flex-col"
        >
          <StickyNotesBoard />
        </motion.div>

        {/* RIGHT: Study Assistance Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full lg:w-[55%] flex flex-col gap-4"
        >
          {/* RIGHT TOP: Pomodoro Timer */}
          <div className="flex-none">
            <PomodoroTimer />
          </div>

          {/* RIGHT CENTER: AI Chatbot */}
          <div className="flex-1 min-h-[320px]">
            <StudyChatbot topic={topic} />
          </div>

          {/* RIGHT BOTTOM: YouTube Search */}
          <div className="flex-none h-[240px]">
            <YouTubeConceptSearch />
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-4 pb-2"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCompleted(true)}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all ${
            completed
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:shadow-[0_0_35px_rgba(52,211,153,0.5)]"
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 ${completed ? "fill-emerald-400" : ""}`} />
          {completed ? "Topic Completed ✓" : "Mark Topic Completed"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/quiz?topic=${encodeURIComponent(topic)}&from=workspace`)}
          className="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all"
        >
          <Brain className="w-5 h-5" />
          Take Knowledge Check
        </motion.button>
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[15%] right-[5%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[0%] w-[25%] h-[25%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

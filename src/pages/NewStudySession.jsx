import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StudyTaskList } from "../components/StudyTaskList";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { MoodMonitor } from "../components/MoodMonitor";
import { YouTubeConceptSearch } from "../components/YouTubeConceptSearch";
import { StopCircle } from "lucide-react";

export function NewStudySession() {
  const navigate = useNavigate();
  const [timerDuration, setTimerDuration] = useState(25); // minutes, controlled by MoodMonitor

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col gap-6 relative">

      {/* ── Top Bar: End Session button ── */}
      <div className="flex items-center justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/insights")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-sm font-semibold transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
        >
          <StopCircle className="w-4 h-4" />
          End Study Session
        </motion.button>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">

        {/* LEFT: Study Planning Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[42%] min-h-[600px] flex flex-col"
        >
          <StudyTaskList />
        </motion.div>

        {/* RIGHT: Study Assistance Panel */}
        <div className="w-full lg:w-[58%] flex flex-col gap-4">

          {/* RIGHT TOP: Pomodoro Timer */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-none"
          >
            <PomodoroTimer defaultMinutes={timerDuration} />
          </motion.div>

          {/* RIGHT BOTTOM: Mood + YouTube side by side */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 flex-1 min-h-0"
          >
            {/* RIGHT BOTTOM LEFT: Mood Monitor */}
            <div className="flex-1 min-w-0">
              <MoodMonitor onDurationChange={setTimerDuration} />
            </div>

            {/* RIGHT BOTTOM RIGHT: YouTube Search */}
            <div className="flex-1 min-w-0 min-h-[380px]">
              <YouTubeConceptSearch />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-[35%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

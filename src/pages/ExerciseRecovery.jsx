import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExerciseCamera } from "../components/ExerciseCamera";
import { ExerciseCounterCard } from "../components/ExerciseCounterCard";
import { ExerciseProgressTracker } from "../components/ExerciseProgressTracker";
import { Dumbbell, ArrowRight, RotateCcw } from "lucide-react";

const EXERCISES = [
  { id: 1, name: "Push-ups",  icon: Dumbbell, target: 10, color: "blue" },
  { id: 2, name: "Sit-ups",   icon: Dumbbell, target: 15, color: "violet" },
  { id: 3, name: "Squats",    icon: Dumbbell, target: 12, color: "emerald" },
];

export function ExerciseRecovery() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(() => Object.fromEntries(EXERCISES.map((e) => [e.id, 0])));
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef(null);
  const activeExRef = useRef(null);

  const exercises = EXERCISES.map((e) => ({ ...e, completed: counts[e.id] }));
  const allDone = exercises.every((e) => e.completed >= e.target);

  // Simulate auto-incrementing for demo (in production, replaced by pose detection events)
  const startSimulation = () => {
    if (intervalRef.current) return;
    const pending = exercises.filter((e) => e.completed < e.target);
    if (!pending.length) return;
    activeExRef.current = pending[0].id;
    intervalRef.current = setInterval(() => {
      setCounts((prev) => {
        const id = activeExRef.current;
        const ex = exercises.find((e) => e.id === id);
        if (!ex) return prev;
        const next = prev[id] + 1;
        if (next >= ex.target) {
          const nextEx = exercises.find((e) => e.id !== id && prev[e.id] < e.target - 1);
          if (nextEx) activeExRef.current = nextEx.id;
        }
        return { ...prev, [id]: Math.min(next, ex.target) };
      });
    }, 600);
  };

  const stopSimulation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const reset = () => {
    stopSimulation();
    setCounts(Object.fromEntries(EXERCISES.map((e) => [e.id, 0])));
    setShowComplete(false);
  };

  useEffect(() => {
    if (allDone && !showComplete) {
      stopSimulation();
      setShowComplete(true);
      const t = setTimeout(() => navigate(-1), 4000);
      return () => clearTimeout(t);
    }
  }, [allDone]);

  useEffect(() => () => stopSimulation(), []);

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="text-[11px] font-bold text-blue-400 tracking-[0.2em] uppercase">Recovery Mode</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Physical Reset</h1>
        <p className="text-sm text-gray-400 mt-1">Complete the exercises to restore your alertness.</p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </motion.div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

        {/* CENTER: Camera */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col gap-4 min-h-[380px]"
        >
          <ExerciseCamera />

          {/* Simulation controls (demo) */}
          <div className="flex gap-3 justify-center">
            <button onClick={startSimulation}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              ▶ Simulate Detection
            </button>
            <button onClick={reset}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-semibold transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </motion.div>

        {/* RIGHT: Exercise Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full lg:w-[360px] flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Recovery Exercises</h2>
          </div>

          {exercises.map((ex, i) => (
            <motion.div key={ex.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.2 }}>
              <ExerciseCounterCard {...ex} />
            </motion.div>
          ))}

          <ExerciseProgressTracker exercises={exercises} />
        </motion.div>
      </div>

      {/* Completion overlay */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="text-center flex flex-col items-center gap-4 px-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.5)]"
              >
                <span className="text-3xl">💪</span>
              </motion.div>
              <h2 className="text-2xl font-black text-white">Recovery Complete!</h2>
              <p className="text-gray-400 text-sm">Returning to your study session…</p>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ArrowRight className="w-4 h-4 animate-bounce" />
                Redirecting in 4 seconds
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[5%] right-[5%] w-[25%] h-[25%] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

export function ExerciseProgressTracker({ exercises }) {
  const total = exercises.length;
  const done = exercises.filter((e) => e.completed >= e.target).length;
  const pct = (done / total) * 100;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Progress</span>
        <span className="text-xs font-bold text-white">{done}/{total} done</span>
      </div>

      {/* Master bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-1.5 mt-1">
        {exercises.map((ex) => {
          const isDone = ex.completed >= ex.target;
          return (
            <div key={ex.name} className="flex items-center gap-2">
              {isDone
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                : <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
              <span className={`text-xs font-medium ${isDone ? "text-gray-400 line-through" : "text-gray-200"}`}>
                {ex.name}
              </span>
              <span className="text-xs text-gray-600 ml-auto">{Math.min(ex.completed, ex.target)}/{ex.target}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

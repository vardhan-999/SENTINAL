import { motion } from "framer-motion";
import { Trophy, RefreshCw, ArrowLeft, TrendingUp, Target, AlertCircle } from "lucide-react";

function getMastery(pct) {
  if (pct >= 80) return { label: "Excellent", msg: "You have a strong understanding of this topic!", icon: Trophy, color: "text-emerald-400", ring: "from-emerald-500 to-teal-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
  if (pct >= 60) return { label: "Good", msg: "Minor revision recommended to solidify your knowledge.", icon: TrendingUp, color: "text-blue-400", ring: "from-blue-500 to-indigo-400", bg: "bg-blue-500/10 border-blue-500/30" };
  if (pct >= 40) return { label: "Fair", msg: "Consider revisiting key concepts before your exam.", icon: Target, color: "text-amber-400", ring: "from-amber-500 to-orange-400", bg: "bg-amber-500/10 border-amber-500/30" };
  return { label: "Needs Review", msg: "Take time to revisit the topic thoroughly — you've got this!", icon: AlertCircle, color: "text-red-400", ring: "from-red-500 to-rose-400", bg: "bg-red-500/10 border-red-500/30" };
}

export function QuizResultReport({ score, total, topic, onRetake, onReturn }) {
  const pct = Math.round((score / total) * 100);
  const mastery = getMastery(pct);
  const Icon = mastery.icon;
  const circumference = 2 * Math.PI * 45; // r=45

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4"
        >
          <Icon className={`w-8 h-8 ${mastery.color}`} />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Quiz Complete!</h2>
        <p className="text-sm text-gray-400 mt-1">{topic}</p>
      </div>

      {/* Score Ring */}
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        <div className="flex-shrink-0 relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-black text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {pct}%
            </motion.span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-full">
          {/* Score card */}
          <div className="glass-card rounded-2xl px-5 py-4 border border-white/5 bg-white/[0.02] flex items-center justify-between">
            <span className="text-sm text-gray-400">Correct Answers</span>
            <span className="text-xl font-bold text-white">{score} <span className="text-gray-500 text-sm">/ {total}</span></span>
          </div>

          {/* Accuracy bar */}
          <div className="glass-card rounded-2xl px-5 py-4 border border-white/5 bg-white/[0.02]">
            <div className="flex justify-between text-xs mb-2 text-gray-400">
              <span>Accuracy</span>
              <span className="font-semibold text-white">{pct}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${mastery.ring}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Mastery badge */}
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 border ${mastery.bg}`}>
            <Icon className={`w-5 h-5 ${mastery.color} flex-shrink-0`} />
            <div>
              <p className={`text-sm font-bold ${mastery.color}`}>{mastery.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{mastery.msg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="glass-card rounded-2xl px-5 py-4 border border-white/5 bg-white/[0.02]">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Suggested Action</p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {pct >= 80
            ? "Great work! Try tackling a more advanced topic or help a peer explain these concepts."
            : pct >= 60
            ? "Review the questions you got wrong, then try the quiz again for a perfect score."
            : "Spend 15–20 minutes reviewing this topic, use the AI Study Assistant for clarifications, then retake."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onRetake}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Quiz
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onReturn}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Study Session
        </motion.button>
      </div>
    </motion.div>
  );
}

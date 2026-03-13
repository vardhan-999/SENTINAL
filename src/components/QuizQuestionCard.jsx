import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export function QuizQuestionCard({ question, qIndex, total, selected, onSelect }) {
  const answered = selected !== null;

  return (
    <motion.div
      key={qIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-5"
    >
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Question {qIndex + 1} of {total}
        </span>
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: `${(qIndex / total) * 100}%` }}
            animate={{ width: `${((qIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-gray-500">{Math.round(((qIndex + 1) / total) * 100)}%</span>
      </div>

      {/* Question */}
      <div className="glass-card rounded-3xl p-8 border border-white/5 bg-white/[0.02]">
        <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed mb-7">
          {question.q}
        </p>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((opt, i) => {
            const letter = ["A", "B", "C", "D"][i];
            const isCorrect = i === question.correct;
            const isSelected = selected === i;

            let style = "border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-indigo-500/30 cursor-pointer";
            if (answered) {
              if (isCorrect)
                style = "border-emerald-500/50 bg-emerald-500/10 cursor-default";
              else if (isSelected && !isCorrect)
                style = "border-red-500/50 bg-red-500/10 cursor-default";
              else
                style = "border-white/5 bg-white/[0.01] opacity-50 cursor-default";
            }

            return (
              <motion.button
                key={i}
                whileHover={!answered ? { scale: 1.01 } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                onClick={() => !answered && onSelect(i)}
                className={`relative flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl border transition-all ${style}`}
              >
                {/* Letter Badge */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  answered && isCorrect ? "bg-emerald-500 text-white" :
                  answered && isSelected && !isCorrect ? "bg-red-500 text-white" :
                  "bg-white/5 text-gray-400"
                }`}>
                  {letter}
                </span>
                <span className={`text-sm font-medium flex-1 ${
                  answered && isCorrect ? "text-emerald-300" :
                  answered && isSelected && !isCorrect ? "text-red-300" :
                  "text-gray-200"
                }`}>
                  {opt}
                </span>
                {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl px-6 py-4 border overflow-hidden ${
              selected === question.correct
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-amber-500/10 border-amber-500/30"
            }`}
          >
            <p className={`text-sm font-bold mb-1 ${selected === question.correct ? "text-emerald-400" : "text-amber-400"}`}>
              {selected === question.correct ? "✔ Correct!" : `✖ Incorrect — Correct Answer: ${["A","B","C","D"][question.correct]}. ${question.options[question.correct]}`}
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

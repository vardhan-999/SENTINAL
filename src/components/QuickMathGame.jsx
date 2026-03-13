import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function genQuestion() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === "+") { a = Math.floor(Math.random() * 50) + 5; b = Math.floor(Math.random() * 50) + 5; answer = a + b; }
  else if (op === "-") { a = Math.floor(Math.random() * 50) + 20; b = Math.floor(Math.random() * 20) + 1; answer = a - b; }
  else { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; }

  // Generate 3 wrong options
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  const opts = [...wrongs, answer].sort(() => Math.random() - 0.5);
  return { expr: `${a} ${op} ${b}`, answer, opts };
}

export function QuickMathGame({ onScore }) {
  const [questions, setQuestions] = useState(() => [genQuestion()]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  const nextQuestion = useCallback((wasCorrect) => {
    setSelected(null);
    setTimeLeft(8);
    setCurrent((c) => {
      const next = c + 1;
      if (next >= questions.length) {
        setQuestions((q) => [...q, genQuestion()]);
      }
      return next;
    });
    if (wasCorrect !== undefined) {
      setStreak((s) => wasCorrect ? s + 1 : 0);
      if (wasCorrect) {
        const pts = 10 + streak * 2;
        setScore((s) => s + pts);
        onScore?.(pts);
      }
    }
  }, [questions.length, streak, onScore]);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { nextQuestion(false); return 8; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, nextQuestion]);

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    clearInterval(timerRef.current);
    const q = questions[current];
    setTimeout(() => nextQuestion(opt === q.answer), 700);
  };

  const q = questions[current];

  if (!started) return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm text-gray-300 text-center">Solve simple math problems as quickly as you can!</p>
      <p className="text-xs text-gray-500">8 seconds per question. Streaks give bonus points!</p>
      <button onClick={() => setStarted(true)} className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]">
        Start Math Sprint
      </button>
    </div>
  );

  return (
    <motion.div key={current} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 py-4">
      {/* Header stats */}
      <div className="flex gap-6 text-center w-full justify-center">
        <div><p className="text-xs text-gray-500">Score</p><p className="text-lg font-black text-white">{score}</p></div>
        <div><p className="text-xs text-gray-500">Streak</p><p className="text-lg font-black text-amber-400">🔥{streak}</p></div>
        <div>
          <p className="text-xs text-gray-500">Time</p>
          <p className={`text-lg font-black ${timeLeft <= 3 ? "text-red-400" : "text-emerald-400"}`}>{timeLeft}s</p>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          animate={{ width: `${(timeLeft / 8) * 100}%` }} transition={{ duration: 1, ease: "linear" }} />
      </div>

      {/* Question */}
      <div className="text-center">
        <p className="text-5xl font-black text-white tabular-nums tracking-tight">{q.expr} = ?</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {q.opts.map((opt, i) => {
          const isCorrect = opt === q.answer;
          const isSelected = selected === opt;
          let cls = "bg-white/[0.03] border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/25";
          if (selected !== null) {
            if (isCorrect) cls = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
            else if (isSelected) cls = "bg-red-500/20 border-red-500/50 text-red-300";
            else cls = "bg-white/[0.01] border-white/5 text-gray-600 opacity-40";
          }
          return (
            <motion.button key={i} whileTap={selected === null ? { scale: 0.95 } : {}}
              onClick={() => handleSelect(opt)}
              className={`py-4 rounded-2xl border text-xl font-black transition-all ${cls}`}>
              {opt}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

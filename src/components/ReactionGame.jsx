import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATES = { idle: "idle", waiting: "waiting", ready: "ready", clicked: "clicked", tooEarly: "tooEarly" };
const COLORS = { waiting: "#0f172a", ready: "#16a34a", tooEarly: "#dc2626" };

export function ReactionGame({ onScore }) {
  const [state, setState] = useState(STATES.idle);
  const [reactionTime, setReactionTime] = useState(null);
  const [scores, setScores] = useState([]);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  const startRound = useCallback(() => {
    setState(STATES.waiting);
    setReactionTime(null);
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setState(STATES.ready);
      startRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === STATES.idle) { startRound(); return; }
    if (state === STATES.waiting) {
      clearTimeout(timerRef.current);
      setState(STATES.tooEarly);
      setTimeout(() => setState(STATES.idle), 1500);
      return;
    }
    if (state === STATES.ready) {
      const ms = Date.now() - startRef.current;
      setReactionTime(ms);
      setState(STATES.clicked);
      const newScores = [...scores, ms].slice(-5);
      setScores(newScores);
      onScore?.(Math.round((1000 / ms) * 10));
      setTimeout(() => setState(STATES.idle), 2000);
    }
  }, [state, scores, startRound, onScore]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const bg = state === STATES.ready ? COLORS.ready : state === STATES.tooEarly ? COLORS.tooEarly : COLORS.waiting;
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Game target */}
      <motion.div
        onClick={handleClick}
        animate={{ backgroundColor: bg }}
        transition={{ duration: 0.08 }}
        className="w-full max-w-lg h-48 rounded-3xl flex items-center justify-center cursor-pointer border border-white/5 shadow-xl select-none"
      >
        <AnimatePresence mode="wait">
          {state === STATES.idle && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <p className="text-lg font-bold text-white">Click to Start</p>
              <p className="text-xs text-gray-400 mt-1">Wait for green, then click as fast as you can!</p>
            </motion.div>
          )}
          {state === STATES.waiting && (
            <motion.p key="wait" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl font-black text-gray-400">
              Wait for it…
            </motion.p>
          )}
          {state === STATES.ready && (
            <motion.p key="go" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600 }}
              className="text-4xl font-black text-white drop-shadow-lg">
              CLICK NOW! ⚡
            </motion.p>
          )}
          {state === STATES.clicked && reactionTime && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <p className="text-4xl font-black text-white">{reactionTime}ms</p>
              <p className="text-sm text-emerald-400 mt-1">{reactionTime < 250 ? "🔥 Superb!" : reactionTime < 400 ? "✅ Good!" : "⏱ Try faster!"}</p>
            </motion.div>
          )}
          {state === STATES.tooEarly && (
            <motion.p key="early" initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-2xl font-black text-white">
              Too early! 🚫
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats */}
      {scores.length > 0 && (
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Last</p>
            <p className="text-lg font-bold text-white">{scores[scores.length - 1]}ms</p>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <p className="text-xs text-gray-500">Best</p>
            <p className="text-lg font-bold text-emerald-400">{Math.min(...scores)}ms</p>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <p className="text-xs text-gray-500">Avg ({scores.length})</p>
            <p className="text-lg font-bold text-blue-400">{avg}ms</p>
          </div>
        </div>
      )}
    </div>
  );
}

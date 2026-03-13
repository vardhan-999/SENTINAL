import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS_MAP = [
  { id: 0, bg: "bg-red-500",    label: "🔴" },
  { id: 1, bg: "bg-blue-500",   label: "🔵" },
  { id: 2, bg: "bg-yellow-400", label: "🟡" },
  { id: 3, bg: "bg-green-500",  label: "🟢" },
  { id: 4, bg: "bg-purple-500", label: "🟣" },
];

function generatePattern(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * COLORS_MAP.length));
}

export function MemoryFlashGame({ onScore }) {
  const [phase, setPhase] = useState("idle"); // idle | show | input | result
  const [pattern, setPattern] = useState([]);
  const [displayIdx, setDisplayIdx] = useState(-1);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [lastResult, setLastResult] = useState(null);

  const startRound = useCallback((lvl = level) => {
    const newPattern = generatePattern(lvl + 2);
    setPattern(newPattern);
    setUserInput([]);
    setPhase("show");
    let i = 0;
    const tick = () => {
      setDisplayIdx(i);
      i++;
      if (i > newPattern.length) {
        setDisplayIdx(-1);
        setPhase("input");
      } else {
        setTimeout(tick, 700);
      }
    };
    setTimeout(tick, 400);
  }, [level]);

  const handleInput = useCallback((colorId) => {
    const next = [...userInput, colorId];
    setUserInput(next);
    if (next.length === pattern.length) {
      const correct = pattern.every((v, i) => v === next[i]);
      setLastResult(correct);
      setPhase("result");
      if (correct) { setLevel((l) => l + 1); onScore?.(level * 10); }
      else setLevel(1);
    }
  }, [userInput, pattern, level, onScore]);

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <p className="text-gray-300 text-sm text-center">A sequence of colors will flash. Repeat it in order!</p>
            <p className="text-xs text-indigo-400 font-bold">Level {level} — {level + 2} colors</p>
            <button onClick={() => startRound(level)} className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              Start Round
            </button>
          </motion.div>
        )}

        {phase === "show" && (
          <motion.div key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Watch the sequence…</p>
            <div className="flex gap-3 flex-wrap justify-center">
              {pattern.map((cId, i) => {
                const c = COLORS_MAP[cId];
                const active = displayIdx === i;
                return (
                  <motion.div key={i}
                    animate={{ scale: active ? 1.4 : 1, opacity: active ? 1 : 0.2 }}
                    className={`w-14 h-14 rounded-full ${c.bg} flex items-center justify-center text-xl shadow-xl`}
                  >
                    {active ? c.label : ""}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5">
            <p className="text-sm text-white font-semibold">Repeat the sequence! ({userInput.length}/{pattern.length})</p>
            <div className="grid grid-cols-5 gap-3">
              {COLORS_MAP.map((c) => (
                <motion.button key={c.id} whileTap={{ scale: 0.88 }} onClick={() => handleInput(c.id)}
                  className={`w-14 h-14 rounded-full ${c.bg} text-2xl shadow-xl hover:scale-110 transition-transform`}>
                  {c.label}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              {pattern.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < userInput.length ? "bg-indigo-400" : "bg-white/10"}`} />
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4 py-4">
            <span className="text-5xl">{lastResult ? "🎉" : "❌"}</span>
            <p className="text-2xl font-black text-white">{lastResult ? "Correct!" : "Wrong!"}</p>
            <p className="text-sm text-gray-400">{lastResult ? `Level ${level}! Keep going.` : "Starting over from Level 1."}</p>
            <button onClick={() => { setPhase("idle"); }} className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all">
              Next Round
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

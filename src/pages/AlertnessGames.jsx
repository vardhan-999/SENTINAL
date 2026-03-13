import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GameCard } from "../components/GameCard";
import { ReactionGame } from "../components/ReactionGame";
import { MemoryFlashGame } from "../components/MemoryFlashGame";
import { QuickMathGame } from "../components/QuickMathGame";
import { Gamepad2, ArrowLeft, Trophy, Zap } from "lucide-react";

const GAMES = [
  {
    id: "reaction",
    name: "Reaction Test",
    emoji: "⚡",
    description: "Wait for green — click as fast as you can!",
  },
  {
    id: "memory",
    name: "Memory Flash",
    emoji: "🧠",
    description: "Watch the color sequence and repeat it back.",
  },
  {
    id: "math",
    name: "Quick Math",
    emoji: "🔢",
    description: "Solve arithmetic problems before time runs out.",
  },
];

function GameArea({ activeId, onScore }) {
  if (activeId === "reaction") return <ReactionGame onScore={onScore} />;
  if (activeId === "memory")   return <MemoryFlashGame onScore={onScore} />;
  if (activeId === "math")     return <QuickMathGame onScore={onScore} />;
  return null;
}

export function AlertnessGames() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const handleScore = useCallback((pts) => {
    setTotalScore((s) => s + pts);
  }, []);

  const handlePlay = (id) => {
    setActiveGame((prev) => (prev === id ? null : id));
  };

  return (
    <div className="h-full w-full max-w-6xl mx-auto flex flex-col gap-5">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold mb-2">
          <Gamepad2 className="w-3.5 h-3.5" />
          Cognitive Recovery Mode
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Focus Recovery Games</h1>
        <p className="text-sm text-gray-400 mt-1">Sharpen your reflexes and restore attention.</p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </motion.div>

      {/* ── Score Banner ── */}
      {totalScore > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/25 w-fit mx-auto"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-white">Session Score: <span className="text-amber-400">{totalScore}</span></span>
          <Zap className="w-4 h-4 text-amber-400" />
        </motion.div>
      )}

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

        {/* LEFT — Game selector cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-[280px] flex flex-col gap-3 flex-shrink-0"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Choose a Game</p>
          {GAMES.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.15 }}
            >
              <GameCard
                game={g}
                isActive={activeGame === g.id}
                onPlay={handlePlay}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT — Active game area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 flex flex-col"
        >
          <div className="glass-card rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col flex-1 overflow-hidden">
            {/* Panel header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 flex-shrink-0">
              {activeGame ? (
                <>
                  <span className="text-xl">{GAMES.find((g) => g.id === activeGame)?.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{GAMES.find((g) => g.id === activeGame)?.name}</h3>
                    <p className="text-xs text-gray-500">{GAMES.find((g) => g.id === activeGame)?.description}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">Select a game from the left to begin.</p>
              )}
            </div>

            {/* Game content */}
            <div className="flex-1 flex flex-col justify-center px-6 py-4 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeGame ? (
                  <motion.div
                    key={activeGame}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <GameArea activeId={activeGame} onScore={handleScore} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-4 text-center py-16"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-4xl">
                      🎮
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-300">Ready to play?</p>
                      <p className="text-sm text-gray-500 mt-1">Pick a game on the left to sharpen your focus.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center pb-2"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_40px_rgba(79,70,229,0.55)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Study Session
        </motion.button>
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] bg-violet-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[25%] h-[25%] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

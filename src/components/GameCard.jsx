import { motion } from "framer-motion";

export function GameCard({ game, onPlay, isActive }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl p-5 border transition-all cursor-pointer ${
        isActive
          ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
          : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
      onClick={() => onPlay(game.id)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`text-2xl`}>{game.emoji}</div>
        <div>
          <h3 className="text-sm font-bold text-white">{game.name}</h3>
          <p className="text-xs text-gray-500">{game.description}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
          isActive
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
        }`}
      >
        {isActive ? "▶ Playing..." : "Play"}
      </motion.button>
    </motion.div>
  );
}

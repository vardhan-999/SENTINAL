import { motion } from "framer-motion";

/**
 * RecoveryOptionPill — a large capsule-style choice button
 * variant: "blue" (Physical Reset) | "dark" (Cognitive Boost)
 */
export function RecoveryOptionPill({ variant = "blue", label, description, icon: Icon, onClick }) {
  const isBlue = variant === "blue";

  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={`relative group flex flex-col items-center justify-center gap-4 w-full max-w-[220px] aspect-[1/2.2] rounded-[60px] border outline-none select-none overflow-hidden transition-shadow duration-500
        ${isBlue
          ? "bg-gradient-to-b from-[#0a1628] to-[#061030] border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.25)]"
          : "bg-gradient-to-b from-[#0c0c0c] to-[#060606] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        }`}
      variants={{
        rest: {},
        hover: {
          boxShadow: isBlue
            ? "0 0 60px rgba(59,130,246,0.6), 0 0 100px rgba(59,130,246,0.3)"
            : "0 0 60px rgba(255,255,255,0.12), 0 0 100px rgba(200,200,255,0.08)",
        },
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Inner glow layer */}
      <motion.div
        className={`absolute inset-0 rounded-[60px] pointer-events-none
          ${isBlue ? "bg-blue-500/5" : "bg-white/[0.02]"}`}
        variants={{
          rest: { opacity: 0.5 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Top sheen line */}
      <div className={`absolute top-4 left-[15%] right-[15%] h-px rounded-full ${isBlue ? "bg-blue-400/30" : "bg-white/10"}`} />

      {/* Floating glow orb */}
      <motion.div
        className={`absolute top-1/4 w-24 h-24 rounded-full blur-3xl pointer-events-none ${isBlue ? "bg-blue-500/20" : "bg-purple-500/10"}`}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

      {/* Icon */}
      <motion.div
        className={`relative z-10 p-4 rounded-full border transition-all
          ${isBlue
            ? "bg-blue-500/10 border-blue-500/30 text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-400/60"
            : "bg-white/5 border-white/10 text-gray-300 group-hover:bg-white/10 group-hover:border-white/25"}`}
        variants={{ rest: { scale: 1 }, hover: { scale: 1.1 } }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-8 h-8" />
      </motion.div>

      {/* Label */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-5">
        <span className={`text-base font-bold tracking-wide ${isBlue ? "text-blue-300" : "text-gray-200"}`}>
          {label}
        </span>
        <p className={`text-[11px] text-center leading-relaxed ${isBlue ? "text-blue-400/70" : "text-gray-500"}`}>
          {description}
        </p>
      </div>

      {/* Bottom sheen line */}
      <div className={`absolute bottom-4 left-[15%] right-[15%] h-px rounded-full ${isBlue ? "bg-blue-400/20" : "bg-white/5"}`} />
    </motion.button>
  );
}

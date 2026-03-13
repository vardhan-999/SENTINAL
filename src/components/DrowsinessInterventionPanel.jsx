import { motion, AnimatePresence } from "framer-motion";
import { RecoveryOptionPill } from "./RecoveryOptionPill";
import { Activity, Gamepad2, X, Eye } from "lucide-react";

/**
 * DrowsinessInterventionPanel
 *
 * A slide-in overlay panel from the right side of the screen triggered
 * when the system detects drowsiness via the camera feed.
 *
 * Usage:
 *   const [showPanel, setShowPanel] = useState(false);
 *   <DrowsinessInterventionPanel isOpen={showPanel} onClose={() => setShowPanel(false)} />
 *
 * The backdrop dims the current page while keeping it visible behind the panel.
 */
export function DrowsinessInterventionPanel({ isOpen, onClose, onExercise, onGames }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Dim backdrop (current page stays visible) ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── Slide-in Panel ── */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] z-[201] overflow-y-auto
                       bg-gradient-to-bl from-[#07090E] via-[#0a0d1a] to-[#06080d]
                       border-l border-white/5 shadow-[-20px_0_60px_rgba(0,0,0,0.7)]
                       flex flex-col"
          >
            {/* Ambient top glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/60 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* ── Header ── */}
            <div className="relative z-10 flex items-start justify-between px-8 pt-8 pb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center"
                >
                  <Eye className="w-5 h-5 text-red-400" />
                </motion.div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 tracking-[0.2em] uppercase block">Sentinel Alert</span>
                  <h2 className="text-lg font-bold text-white mt-0.5 leading-tight">Focus Lost Detected</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-8 h-px bg-gradient-to-r from-red-500/30 via-white/5 to-transparent mb-2" />

            {/* ── Subtitle ── */}
            <div className="relative z-10 px-8 my-4 text-center">
              <p className="text-sm text-gray-300 leading-relaxed">
                Looks like you're getting tired.<br />
                <span className="text-white font-semibold">Choose how you want to recover.</span>
              </p>
            </div>

            {/* ── Pill Choices ── */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-6">

              {/* "Two choices" label — Matrix reference */}
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xs text-gray-600 tracking-[0.25em] uppercase mb-8 text-center select-none"
              >
                You take the blue pill&nbsp;&mdash;&nbsp;or the other one
              </motion.p>

              {/* Pill row */}
              <div className="flex items-end justify-center gap-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 22 }}
                >
                  <RecoveryOptionPill
                    variant="blue"
                    label="Physical Reset"
                    description="Quick guided exercises to wake your body and restore alertness."
                    icon={Activity}
                    onClick={() => { onExercise?.(); onClose?.(); }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 22 }}
                >
                  <RecoveryOptionPill
                    variant="dark"
                    label="Cognitive Boost"
                    description="Play a short reflex or reaction game to sharpen your focus."
                    icon={Gamepad2}
                    onClick={() => { onGames?.(); onClose?.(); }}
                  />
                </motion.div>
              </div>
            </div>

            {/* ── Dismiss link ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="relative z-10 flex justify-center pb-10"
            >
              <button
                onClick={onClose}
                className="text-xs text-gray-600 hover:text-gray-300 underline underline-offset-4 transition-colors"
              >
                Dismiss for now
              </button>
            </motion.div>

            {/* Bottom ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-48 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

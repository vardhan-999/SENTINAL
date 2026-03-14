import { motion, AnimatePresence } from "framer-motion";
import { X, Pin, Sparkles } from "lucide-react";

export function StickyNote({ headings, onClose }) {
  if (!headings || headings.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-yellow-200/95 p-8 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] border-l-8 border-yellow-400/50"
          style={{
            fontFamily: "'Gloria Hallelujah', cursive",
            backgroundImage: "radial-gradient(#ecf0f1 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        >
          {/* Push Pin */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-600 drop-shadow-lg">
            <Pin className="w-10 h-10 fill-current" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight border-b-2 border-black/10 pb-1">
              Main Study Headings
            </h2>
          </div>

          <div className="space-y-4">
            {headings.map((heading, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg font-black text-indigo-600 mt-0.5">•</span>
                <p className="text-lg text-gray-800 font-semibold leading-tight">
                  {heading}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-xs text-gray-500 italic text-center border-t border-black/5 pt-4">
            Extracted via Sentinel AI Engine
          </p>

          {/* Paper shadow/curl effect */}
          <div className="absolute -bottom-2 -right-2 w-full h-full bg-black/10 -z-10 blur-xl" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import { YouTubeConceptSearch } from "../components/YouTubeConceptSearch";
import { PlaySquare, Lightbulb } from "lucide-react";

const FEATURED = [
  "Process Scheduling Explained",
  "Database Normalization Guide",
  "Computer Networks Full Course",
  "Machine Learning for Beginners",
  "Operating Systems Concepts",
];

export function VideoSearchPage() {
  return (
    <div className="h-full w-full max-w-4xl mx-auto flex flex-col gap-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-3">
          <PlaySquare className="w-3.5 h-3.5" />
          Concept Video Finder
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Focused Study Media</h1>
        <p className="text-sm text-gray-400 mt-1">Find the best learning videos for any topic, instantly.</p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      </motion.div>

      {/* Suggested searches */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Suggested Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FEATURED.map((t, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-400 hover:text-white hover:border-red-500/30 hover:bg-red-500/10 cursor-default transition-all">
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Video search component — takes all remaining height */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex-1 min-h-[500px]"
      >
        <YouTubeConceptSearch />
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[10%] right-[5%] w-[25%] h-[30%] bg-red-600/4 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[20%] h-[25%] bg-rose-500/4 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

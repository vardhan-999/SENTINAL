import { motion } from "framer-motion";
import { PlayCircle, Target, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StudySessionPanel() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-3xl p-8 border border-white/5 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="text-center sm:text-left flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            AI Monitored
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Start New Study Session
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-sm mx-auto sm:mx-0 leading-relaxed font-medium">
            Launch a monitored study session with real-time focus tracking and AI-powered insights.
          </p>
        </div>

        <div className="w-full sm:w-auto flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/study")}
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-indigo-600 text-white rounded-2xl px-6 py-4 font-semibold shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            <PlayCircle className="w-6 h-6 fill-indigo-400/30 group-hover:fill-indigo-400/50 transition-colors" />
            Begin Focus Session
          </motion.button>
        </div>
      </div>

      {/* Mini Stats Row */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">85%</div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Avg Focus</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">12.4h</div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">This Week</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

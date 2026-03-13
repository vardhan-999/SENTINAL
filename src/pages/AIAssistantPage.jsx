import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StudyChatbot } from "../components/StudyChatbot";
import { Bot, Sparkles, ArrowLeft } from "lucide-react";

const QUICK_PROMPTS = [
  "Summarize my notes on Process Scheduling",
  "Explain deadlock prevention simply",
  "Create flashcards for Normalization",
  "Give me 5 key points on B+ Trees",
  "What's the difference between TCP and UDP?",
];

export function AIAssistantPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full max-w-3xl mx-auto flex flex-col gap-5">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-3">
          <Bot className="w-3.5 h-3.5" />
          AI Powered
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Study Assistant</h1>
        <p className="text-sm text-gray-400 mt-1">Summarize notes, ask questions, and get instant AI-powered help.</p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </motion.div>

      {/* Quick prompts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {QUICK_PROMPTS.map((p, i) => (
          <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-400 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/10 cursor-default transition-all">
            {p}
          </span>
        ))}
      </motion.div>

      {/* Chat box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex-1 min-h-[500px]"
      >
        <StudyChatbot topic="General Study & Note Summarization" />
      </motion.div>

      {/* Capability hints */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { emoji: "📝", label: "Summarize Notes" },
          { emoji: "❓", label: "Answer Questions" },
          { emoji: "🃏", label: "Generate Flashcards" },
        ].map((c) => (
          <div key={c.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-xl">{c.emoji}</span>
            <span className="text-[11px] text-gray-500 font-medium">{c.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[10%] right-[5%] w-[25%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[20%] h-[25%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

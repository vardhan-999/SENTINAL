import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TopicSummaryPanel() {
  const summaries = [
    "Deadlock prevention strategies involves constraining resource requests and ensuring resource allocation ordering to negate hold-and-wait conditions.",
    "B+ tree indexing structure optimizes disk I/O with high fanout and leaf-node linked lists, drastically improving sequential search performance.",
    "TCP congestion control mechanisms utilize AIMD (Additive Increase Multiplicative Decrease) and slow start to regulate flow and prevent network collapse.",
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-gradient-to-br from-indigo-900/10 to-transparent relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="mb-5 flex items-center gap-2 relative z-10">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-white tracking-tight">AI Revision Summary</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        <ul className="space-y-4">
          {summaries.map((summary, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 + 0.3 }}
              className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <p>{summary}</p>
            </motion.li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}

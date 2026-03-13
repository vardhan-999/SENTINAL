import { motion } from "framer-motion";
import { Clock, BookOpen, Layers } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

const revisionTopics = [
  {
    id: 1,
    title: "Process Scheduling",
    subject: "Operating Systems",
    lastStudied: "2 hours ago",
    icon: Layers,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Indexing",
    subject: "Database Systems",
    lastStudied: "Yesterday",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: 3,
    title: "TCP/IP Basics",
    subject: "Computer Networks",
    lastStudied: "3 days ago",
    icon: Clock,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

export function RevisionPanel() {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-white/[0.02]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Revision Queue</h2>
        <p className="text-sm text-gray-400 mt-1">Topics recommended for review based on your forgetting curve.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
        {revisionTopics.map((topic, idx) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            className="group flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] transition-colors cursor-pointer"
          >
            <div className={`p-3 rounded-xl ${topic.bg} border border-white/5`}>
              <topic.icon className={`w-6 h-6 ${topic.color}`} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-semibold text-gray-100 group-hover:text-indigo-400 transition-colors">
                {topic.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{topic.subject}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {topic.lastStudied}
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500/50 mt-3 group-hover:bg-indigo-400 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="pt-2 border-t border-white/5">
        <Button 
          onClick={() => navigate("/revision")}
          className="w-full font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.15)] group"
        >
          Start Revision Session
          <motion.span
            className="inline-block ml-2"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Button>
      </div>
    </div>
  );
}

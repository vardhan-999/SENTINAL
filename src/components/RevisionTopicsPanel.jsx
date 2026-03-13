import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, Layers, Terminal } from "lucide-react";

const topics = [
  {
    id: 1,
    title: "Deadlock Prevention",
    subject: "Operating Systems",
    completed: true,
    icon: Terminal,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "B+ Trees",
    subject: "Database Systems",
    completed: false,
    icon: Layers,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: 3,
    title: "Congestion Control",
    subject: "Computer Networks",
    completed: false,
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

export function RevisionTopicsPanel() {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-white/[0.02]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Revision Topics</h2>
        <p className="text-sm text-gray-400 mt-1">
          Topics identified from your previous study session.
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] transition-all cursor-pointer"
          >
            <div className={`p-3 rounded-xl ${topic.bg} border border-white/5`}>
              <topic.icon className={`w-6 h-6 ${topic.color}`} />
            </div>
            
            <div className="flex-1">
              <h3 className={`text-sm font-semibold transition-colors ${topic.completed ? 'text-gray-400 line-through' : 'text-gray-100 group-hover:text-indigo-400'}`}>
                {topic.title}
              </h3>
              <div className="mt-1">
                <span className="text-xs font-medium bg-white/5 px-2 py-0.5 rounded-md border border-white/5 text-gray-400">
                  {topic.subject}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 mr-2">
              {topic.completed ? (
                <CheckCircle2 className="w-6 h-6 text-indigo-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, Layers, Clock, Terminal } from "lucide-react";

const iconMap = { Layers, BookOpen, Clock, Terminal };

export function RevisionTopicsPanel() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("sentinel_revision_queue");
    if (saved) {
      setTopics(JSON.parse(saved));
    }
  }, []);

  const toggleTopic = (id) => {
    const newTopics = topics.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTopics(newTopics);
    localStorage.setItem("sentinel_revision_queue", JSON.stringify(newTopics));
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-white/[0.02]">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Revision Topics</h2>
          <p className="text-sm text-gray-400 mt-1">
            Dynamic priorities synced from your dashboard.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 tracking-wider uppercase">Live Sync Active</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            onClick={() => toggleTopic(topic.id)}
            className={`group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] transition-all cursor-pointer ${topic.completed ? 'opacity-60' : ''}`}
          >
            <div className={`p-3 rounded-xl ${topic.bg} border border-white/5`}>
              {(() => {
                const IconComp = iconMap[topic.iconName] || BookOpen;
                return <IconComp className={`w-6 h-6 ${topic.color}`} />;
              })()}
            </div>
            
            <div className="flex-1">
              <h3 className={`text-sm font-bold transition-colors ${topic.completed ? 'text-gray-400 line-through' : 'text-gray-100 group-hover:text-indigo-400'}`}>
                {topic.title}
              </h3>
              <div className="mt-1">
                <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/5 text-gray-500 uppercase">
                  {topic.subject || "Revision"}
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
        {topics.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] rounded-3xl border-2 border-dashed border-white/5">
            <p className="text-gray-500 text-sm font-medium">No revision topics found.</p>
            <p className="text-[10px] text-gray-600 uppercase mt-2">Add topics in the Dashboard Dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}

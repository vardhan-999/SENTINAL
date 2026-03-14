import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, Layers, Plus, X } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const INITIAL_TOPICS = [
  {
    id: 1,
    title: "Process Scheduling",
    subject: "Operating Systems",
    lastStudied: "2 hours ago",
    iconName: "Layers",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    completed: false
  },
];

const iconMap = { Layers, BookOpen, Clock };

export function RevisionPanel() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem("sentinel_revision_queue");
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    localStorage.setItem("sentinel_revision_queue", JSON.stringify(topics));
  }, [topics]);

  const addTopic = () => {
    if (!newTopicTitle.trim()) return;
    const newTopic = {
      id: Date.now(),
      title: newTopicTitle.trim(),
      subject: "Custom",
      lastStudied: "Just now",
      iconName: "BookOpen",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      completed: false
    };
    setTopics([...topics, newTopic]);
    setNewTopicTitle("");
    setShowInput(false);
  };

  const removeTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTopics(topics.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-white/[0.02]">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Revision Queue</h2>
          <p className="text-sm text-gray-400 mt-1">Directly manage your study priorities.</p>
        </div>
        <button 
          onClick={() => setShowInput(!showInput)}
          className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="mb-6 flex gap-2"
          >
            <input 
              autoFocus
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTopic()}
              placeholder="Add topic to queue..."
              className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <Button onClick={addTopic} className="h-12 px-4 rounded-xl">Add</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar min-h-[200px]">
        <AnimatePresence>
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              className={`group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] transition-colors relative h-[72px] cursor-pointer ${topic.completed ? 'opacity-50' : ''}`}
              onClick={() => toggleComplete(topic.id)}
            >
              <div className={`p-3 rounded-xl ${topic.bg} border border-white/5 flex-shrink-0`}>
                {(() => {
                  const IconComp = iconMap[topic.iconName] || BookOpen;
                  return <IconComp className={`w-5 h-5 ${topic.color}`} />;
                })()}
              </div>
              
              <div className="flex-1 py-1 overflow-hidden">
                <h3 className={`text-sm font-bold group-hover:text-indigo-400 transition-colors leading-tight truncate ${topic.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
                  {topic.title}
                </h3>
              </div>

              <button 
                onClick={() => removeTopic(topic.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all hover:bg-red-500/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {topics.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-sm">Queue is empty</p>
            <p className="text-[10px] uppercase font-bold mt-1">Add a topic above</p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-white/5">
        <Button 
          onClick={() => navigate("/revision")}
          className="w-full font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.15)] group"
        >
          Start Revision Session
          <motion.span className="inline-block ml-2" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
        </Button>
      </div>
    </div>
  );
}

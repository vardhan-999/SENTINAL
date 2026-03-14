import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, X, Clock, CheckCircle2, Circle, FileText, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StickyNote } from "./StickyNote";

const DEFAULT_TASKS = [
  { id: 1, title: "Process Scheduling", subject: "Operating Systems", duration: 30, done: false },
];

function estimateDuration(title) {
  const words = title.split(" ").length;
  return Math.max(15, Math.min(45, words * 8 + 15));
}

export function StudyTaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedHeadings, setExtractedHeadings] = useState([]);
  const fileInputRef = useRef(null);

  const userId = 1;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/tasks/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTasks(data.map(t => ({ id: t.id, title: t.title, subject: t.topic, duration: 30, done: t.status === 'done' })));
        } else {
          setTasks(DEFAULT_TASKS);
        }
      })
      .catch(() => setTasks(DEFAULT_TASKS));
  }, []);

  const toggleTask = (id) =>
    setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  const removeTask = (id) => setTasks((t) => t.filter((task) => task.id !== id));

  const addTask = async () => {
    const trimmed = newTopic.trim();
    if (!trimmed) return;

    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title: trimmed, topic: "Custom" }),
      });
      const data = await resp.json();
      
      setTasks((t) => [
        ...t,
        { id: data.id, title: trimmed, subject: "Custom", duration: estimateDuration(trimmed), done: false },
      ]);
      setNewTopic("");
      setShowInput(false);
    } catch (e) {
      console.error("Failed to save task", e);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploadedFile(file.name);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        
        // Simulating backend AI analysis or simple heuristic
        // Real logic: lines that are short, underlined with dashes, or capitalized
        const lines = text.split('\n');
        const headings = lines
          .map(l => l.trim())
          .filter(l => l.length > 3 && l.length < 50) // reasonable length
          .filter(l => /^[A-Z0-9\s\W]+$/.test(l) || l.includes('Chapter') || l.includes('Module') || l.startsWith('#'))
          .slice(0, 5); // Just first few main headings

        // Fallback if no clear headings
        const finalHeadings = headings.length > 0 ? headings : ["Overview", "Key Concepts", "Detailed Analysis"];
        
        // Short delay for "AI effect"
        setTimeout(() => {
          setExtractedHeadings(finalHeadings);
          setIsAnalyzing(false);
          
          // Also add them as tasks
          const newTasks = finalHeadings.map((h, i) => ({
            id: Date.now() + i,
            title: h,
            subject: "Extracted",
            duration: 20,
            done: false
          }));
          setTasks(prev => [...prev, ...newTasks]);
        }, 1500);
      };

      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        reader.readAsText(file);
      } else {
        // Mock analysis for PDF/DOCX if we can't parse easily in frontend
        setTimeout(() => {
          setExtractedHeadings(["Summary of " + file.name, "Phase 1: Fundamentals", "Phase 2: Applications"]);
          setIsAnalyzing(false);
        }, 2000);
      }
    } catch (err) {
      console.error("File analysis error:", err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-white/[0.02]">
      <StickyNote headings={extractedHeadings} onClose={() => setExtractedHeadings([])} />

      {/* Syllabus Upload */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Import Study Plan
        </h2>
        <div
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 hover:border-indigo-500/50 hover:bg-white/5"}`}
        >
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm font-bold text-indigo-400 animate-pulse uppercase tracking-widest">Sentinel AI Analyzing...</p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Upload className="w-6 h-6 text-indigo-400" />
              </div>
              {uploadedFile ? (
                <div className="text-center">
                  <p className="text-sm text-emerald-400 font-bold">{uploadedFile}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">Ready for re-upload</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-300">Drop your syllabus or notes here</p>
                  <p className="text-xs text-gray-500">Supports PDF, DOCX, TXT</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Tasks</h3>
          <span className="text-xs text-gray-500">{tasks.filter(t=>t.done).length}/{tasks.length} done</span>
        </div>

        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                onClick={() => navigate(`/workspace?topic=${encodeURIComponent(task.title)}&subject=${encodeURIComponent(task.subject)}`)}
                className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${task.done ? "border-white/5 bg-white/[0.01] opacity-60" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"}`}
              >
                <button onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} className="flex-shrink-0">
                  {task.done
                    ? <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    : <Circle className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.done ? "line-through text-gray-500" : "text-gray-100"}`}>{task.title}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{task.subject}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 flex-shrink-0 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>{task.duration}m</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                <button
                  onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Custom Topic */}
        <div className="mt-4">
          <AnimatePresence>
            {showInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addTask(); if (e.key === "Escape") { setShowInput(false); setNewTopic(""); } }}
                    placeholder="e.g. Memory Management"
                    className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
                  />
                  <button onClick={addTask} className="px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">Add</button>
                  <button onClick={() => { setShowInput(false); setNewTopic(""); }} className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-500/20 transition-colors">
              <Plus className="w-4 h-4 text-indigo-400" />
            </div>
            Add custom topic
          </button>
        </div>
      </div>
    </div>
  );
}

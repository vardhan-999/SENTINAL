import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, GripHorizontal } from "lucide-react";

const NOTE_COLORS = [
  { bg: "bg-yellow-400/90", text: "text-yellow-900", header: "bg-yellow-500/80" },
  { bg: "bg-pink-400/90", text: "text-pink-900", header: "bg-pink-500/80" },
  { bg: "bg-indigo-400/90", text: "text-indigo-900", header: "bg-indigo-500/80" },
  { bg: "bg-emerald-400/90", text: "text-emerald-900", header: "bg-emerald-500/80" },
  { bg: "bg-orange-400/90", text: "text-orange-900", header: "bg-orange-500/80" },
];

let noteIdCounter = 1;

function StickyNote({ note, onUpdate, onDelete }) {
  const [pos, setPos] = useState(note.pos);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const color = NOTE_COLORS[note.colorIdx % NOTE_COLORS.length];

  const onMouseDown = useCallback((e) => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMouseMove = (me) => {
      setPos({ x: me.clientX - dragStart.current.x, y: me.clientY - dragStart.current.y });
    };
    const onMouseUp = (me) => {
      setIsDragging(false);
      onUpdate(note.id, { pos: { x: me.clientX - dragStart.current.x, y: me.clientY - dragStart.current.y } });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [pos, note.id, onUpdate]);

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, rotate: (Math.random() - 0.5) * 8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0.5, opacity: 0 }}
      style={{ left: pos.x, top: pos.y, position: "absolute", zIndex: isDragging ? 100 : 10 }}
      className={`w-52 rounded-2xl shadow-2xl ${color.bg} select-none flex flex-col overflow-hidden border border-white/20`}
    >
      {/* Drag handle bar */}
      <div
        onMouseDown={onMouseDown}
        className={`${color.header} flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing`}
      >
        <GripHorizontal className={`w-4 h-4 ${color.text} opacity-60`} />
        <button
          onClick={() => onDelete(note.id)}
          className={`${color.text} opacity-60 hover:opacity-100 transition-opacity`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <input
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Title (optional)"
          className={`bg-transparent border-none outline-none text-sm font-bold ${color.text} placeholder:opacity-50 w-full`}
        />
        <textarea
          value={note.content}
          onChange={(e) => onUpdate(note.id, { content: e.target.value })}
          placeholder="Write your note..."
          rows={4}
          className={`bg-transparent border-none outline-none resize-none text-xs leading-relaxed ${color.text} placeholder:opacity-50 w-full`}
        />
      </div>
    </motion.div>
  );
}

export function StickyNotesBoard() {
  const [notes, setNotes] = useState([
    { id: noteIdCounter++, title: "Key Concept", content: "Deadlock requires: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.", pos: { x: 40, y: 60 }, colorIdx: 0 },
    { id: noteIdCounter++, title: "Remember!", content: "Banker's Algorithm for deadlock avoidance.", pos: { x: 260, y: 100 }, colorIdx: 1 },
  ]);

  const addNote = () => {
    const spread = notes.length * 20;
    setNotes((n) => [
      ...n,
      { id: noteIdCounter++, title: "", content: "", pos: { x: 60 + spread % 150, y: 50 + spread % 120 }, colorIdx: noteIdCounter % NOTE_COLORS.length },
    ]);
  };

  const updateNote = (id, changes) =>
    setNotes((n) => n.map((note) => note.id === id ? { ...note, ...changes } : note));

  const deleteNote = (id) =>
    setNotes((n) => n.filter((note) => note.id !== id));

  return (
    <div className="glass-card rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0 z-20 relative">
        <div>
          <h2 className="text-base font-bold text-white">Sticky Notes</h2>
          <p className="text-xs text-gray-500 mt-0.5">Drag to reposition · Click to edit</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addNote}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </motion.button>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-hidden">
        {/* Cork board texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,#fff,#fff_1px,transparent_1px,transparent_8px)] pointer-events-none" />

        <AnimatePresence>
          {notes.map((note) => (
            <StickyNote key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
              <Plus className="w-8 h-8 text-yellow-400/40" />
            </div>
            <p className="text-sm">Add your first note</p>
          </div>
        )}
      </div>
    </div>
  );
}

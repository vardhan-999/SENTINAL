import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  BarChart2, 
  Brain, 
  FileText, 
  PlaySquare, 
  Gamepad2, 
  Bot, 
  LogOut 
} from "lucide-react";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: BarChart2,  label: "Analytics Dashboard",    action: () => navigate("/analytics"),    badge: null },
    { icon: Brain,      label: "AI Quiz Generator",      action: () => navigate("/quiz"),          badge: "New" },
    { icon: FileText,   label: "Smart Notes Summarizer", action: () => navigate("/ai-assistant"),  badge: null },
    { icon: PlaySquare, label: "Focused Study Media",    action: () => navigate("/video-search"),  badge: null },
    { icon: Gamepad2,   label: "Cognitive Alert Games",  action: () => navigate("/alert-games"),   badge: null },
    { icon: Bot,        label: "AI Study Assistant",     action: () => navigate("/ai-assistant"),  badge: null },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)] flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {/* Placeholder Avatar - can be replaced with an image later */}
        <User className="w-5 h-5 text-indigo-300" />
        {/* Connection Indicator */}
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] border border-gray-900" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-3 w-64 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-3xl bg-[#0e121d]/90 z-50 origin-top-right"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <p className="text-sm font-semibold text-white">Guest Scholar</p>
              <p className="text-xs text-gray-400">Level 4 Innovator</p>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-0.5">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => { item.action?.(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors group"
                >
                  <item.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/25">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 mt-1 border-t border-white/5">
              <button
                onClick={() => { navigate("/"); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 rounded-xl hover:bg-red-500/10 transition-colors group"
              >
                <LogOut className="w-4 h-4 group-hover:text-red-500" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

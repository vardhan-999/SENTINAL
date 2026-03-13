import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../utils/cn";

export function PomodoroTimer({ defaultMinutes = 25 }) {
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  // Reset when recommended duration changes from MoodMonitor
  // eslint-disable-next-line react-hooks/exhaustive-deps
  typeof useEffect === 'function' && (() => {})();

  // Sync when defaultMinutes changes from MoodMonitor
  useEffect(() => {
    setIsActive(false);
    setTimeLeft(defaultMinutes * 60);
  }, [defaultMinutes]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(defaultMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const totalTime = defaultMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center h-full border border-white/5 bg-white/[0.02]">
      
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Timer className="w-5 h-5 text-red-400" />
          Focus Session
        </h2>
      </div>

      {/* 3D Tomato Timer Body */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 group">
        
        {/* Outer Glow */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-red-600/30 blur-2xl transition-opacity duration-700 pointer-events-none",
          isActive ? "opacity-100 animate-pulse" : "opacity-40"
        )} />

        {/* 3D Tomato Sphere */}
        <motion.div 
          className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.6),inset_10px_10px_20px_rgba(255,100,100,0.8),0_15px_35px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#ff5b5b] via-[#e63946] to-[#9b1522] flex items-center justify-center border-4 border-red-500/20"
          animate={{
            scale: isActive ? [1, 1.02, 1] : 1,
          }}
          transition={{
            repeat: isActive ? Infinity : 0,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          {/* Inner Dial */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#111] shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] border-4 border-red-900/50 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
              />
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="#ef4444"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 46}%`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}%`}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>

            {/* Time Text */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-red-300/80 font-bold uppercase tracking-[0.2em] mt-1">
                {isActive ? "Focusing" : "Ready"}
              </span>
            </div>
            
            {/* Shine highlight */}
            <div className="absolute top-0 left-[20%] w-[60%] h-[30%] bg-gradient-to-b from-white/10 to-transparent rounded-full opacity-50 pointer-events-none" />
          </div>
        </motion.div>
        
        {/* Tomato Leaves (Decorative) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-green-500 to-green-800 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4)]" />
          <div className="absolute top-2 left-1 w-6 h-3 bg-gradient-to-br from-green-400 to-green-700 rounded-full -rotate-45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4)]" />
          <div className="absolute top-2 right-1 w-6 h-3 bg-gradient-to-bl from-green-400 to-green-700 rounded-full rotate-45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4)]" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          onClick={toggleTimer}
          className={cn(
             "w-[140px] text-white rounded-xl shadow-xl transition-all",
             isActive 
              ? "bg-gray-800 hover:bg-gray-700 border border-gray-600" 
              : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-500/50 shadow-[0_5px_20px_rgba(239,68,68,0.4)]"
          )}
        >
          {isActive ? (
            <><Pause className="w-4 h-4 mr-2" fill="currentColor" /> Pause</>
          ) : (
            <><Play className="w-4 h-4 mr-2" fill="currentColor" /> Start</>
          )}
        </Button>
        <Button
          onClick={resetTimer}
          variant="secondary"
          className="w-12 h-12 p-0 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
}

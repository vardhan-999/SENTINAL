import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CameraMonitor } from "./CameraMonitor";
import { ProfileMenu } from "./ProfileMenu";
import { FocusBar } from "./FocusBar";
import { DrowsinessInterventionPanel } from "./DrowsinessInterventionPanel";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export function SessionLayout() {
  const navigate = useNavigate();
  const [drowsyPanelOpen, setDrowsyPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090E] text-white overflow-hidden relative">
      
      {/* Top Header - Focus Bar tracking */}
      <div className="absolute top-0 left-0 right-0 h-10 z-40 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-center">
        <FocusBar />
      </div>

      {/* Persistent floating elements */}
      <div className="absolute top-14 left-0 right-0 p-6 flex justify-between items-start z-50 pointer-events-none">
        
        {/* Top Left: Camera Monitor + monitoring label + drowsy trigger */}
        <div className="pointer-events-auto flex flex-col items-start gap-2">
          <CameraMonitor />
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Focus Monitoring Active</span>
          </div>

          {/* Demo drowsiness trigger button */}
          <button
            onClick={() => setDrowsyPanelOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[11px] font-semibold transition-all backdrop-blur-md shadow-lg"
          >
            <AlertTriangle className="w-3 h-3" />
            Simulate Drowsiness
          </button>
        </div>

        {/* Top Right: Back button + Profile Menu */}
        <div className="pointer-events-auto flex items-center gap-3 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <ProfileMenu />
        </div>

      </div>

      {/* Main Page Content */}
      <main className="w-full h-screen pt-32 px-6 pb-6 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* Drowsiness Intervention Panel (global, slides in from right) */}
      <DrowsinessInterventionPanel
        isOpen={drowsyPanelOpen}
        onClose={() => setDrowsyPanelOpen(false)}
        onExercise={() => { setDrowsyPanelOpen(false); navigate("/exercise"); }}
        onGames={() => { setDrowsyPanelOpen(false); navigate("/games"); }}
      />
    </div>
  );
}

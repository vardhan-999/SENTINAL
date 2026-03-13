import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RevisionTopicsPanel } from "../components/RevisionTopicsPanel";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { TopicSummaryPanel } from "../components/TopicSummaryPanel";
import { Button } from "../components/Button";
import { Brain } from "lucide-react";

export function RevisionSession() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col items-center gap-6 relative">
      
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Left Column: Revision Topics */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <RevisionTopicsPanel />
        </div>

        {/* Right Column: Pomodoro + Summary */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex-none h-[400px]">
            <PomodoroTimer />
          </div>
          <div className="flex-1 min-h-[300px]">
            <TopicSummaryPanel />
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="fixed bottom-10 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 0.6 }}
           className="pointer-events-auto"
        >
          <Button 
            onClick={() => navigate("/quiz?topic=Operating+Systems,+Databases,+Networks&from=revision")}
            className="h-16 px-12 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] group transition-all"
          >
            <Brain className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Take Knowledge Check
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      </div>

      {/* Subtle decorative background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

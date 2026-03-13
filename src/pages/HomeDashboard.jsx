import { RevisionPanel } from "../components/RevisionPanel";
import { StudySessionPanel } from "../components/StudySessionPanel";
import { FocusAnalyticsChart } from "../components/FocusAnalyticsChart";
import { motion } from "framer-motion";

export function HomeDashboard() {
  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Left Column: Revision Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full lg:w-1/3 flex flex-col"
      >
        <RevisionPanel />
      </motion.div>

      {/* Right Column: Study Session + Analytics */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StudySessionPanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 min-h-[400px]"
        >
          <FocusAnalyticsChart />
        </motion.div>
      </div>

    </div>
  );
}

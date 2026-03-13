import { motion } from "framer-motion";

// Generate 10 weeks of mock study data (Mon–Sun)
function generateHeatmap() {
  const weeks = [];
  const today = new Date();
  for (let w = 9; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - w * 7 - (6 - d));
      const rand = Math.random();
      const hours = rand > 0.3 ? parseFloat((rand * 5).toFixed(1)) : 0;
      days.push({ date, hours });
    }
    weeks.push(days);
  }
  return weeks;
}

const WEEKS = generateHeatmap();
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function getColor(hours) {
  if (hours === 0) return "bg-white/[0.03] border-white/5";
  if (hours < 1.5) return "bg-indigo-500/20 border-indigo-500/20";
  if (hours < 3)   return "bg-indigo-500/40 border-indigo-500/30";
  if (hours < 4.5) return "bg-indigo-500/60 border-indigo-500/40";
  return "bg-indigo-500/90 border-indigo-500/60";
}

export function StudyHeatmap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">🗓️ Study Consistency Calendar</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-600">Less</span>
          {["bg-white/[0.03]", "bg-indigo-500/20", "bg-indigo-500/40", "bg-indigo-500/60", "bg-indigo-500/90"].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c} border border-white/5`} />
          ))}
          <span className="text-[10px] text-gray-600">More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1.5 mr-1 justify-between py-0.5">
            {DAYS.map((d, i) => (
              <div key={i} className="w-5 h-5 flex items-center justify-center">
                <span className="text-[9px] text-gray-600">{d}</span>
              </div>
            ))}
          </div>

          {/* Weeks */}
          {WEEKS.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date.toDateString()}\n${day.hours > 0 ? day.hours + "h studied" : "No activity"}`}
                  className={`w-5 h-5 rounded-sm border transition-all hover:scale-125 cursor-default ${getColor(day.hours)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

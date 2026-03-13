import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

const DATA = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 1.5 },
  { day: "Fri", hours: 5.0 },
  { day: "Sat", hours: 3.0 },
  { day: "Sun", hours: 1.0 },
];
const MAX = Math.max(...DATA.map(d => d.hours));

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400">{label}</p>
      <p className="text-emerald-400 font-bold">{payload[0].value}h studied</p>
    </div>
  );
};

export function StudyTimeBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
    >
      <h3 className="text-sm font-bold text-white mb-4">📅 Study Time by Day</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
            <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="hours" radius={[8, 8, 0, 0]} maxBarSize={40}>
              {DATA.map((d, i) => (
                <Cell key={i} fill={d.hours === MAX ? "#22c55e" : "#6366f1"} fillOpacity={d.hours === MAX ? 1 : 0.6} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-gray-500 mt-2 text-center">Friday was your most productive day 🏆</p>
    </motion.div>
  );
}

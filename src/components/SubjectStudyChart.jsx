import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts";
import { motion } from "framer-motion";

const DATA = [
  { subject: "Operating Systems",  hours: 12.5, color: "#6366f1" },
  { subject: "Database Systems",   hours: 9.0,  color: "#8b5cf6" },
  { subject: "Computer Networks",  hours: 7.5,  color: "#3b82f6" },
  { subject: "Machine Learning",   hours: 6.0,  color: "#06b6d4" },
  { subject: "Data Structures",    hours: 4.5,  color: "#22c55e" },
];

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-bold">{payload[0].payload.subject}</p>
      <p style={{ color: payload[0].payload.color }}>{payload[0].value}h</p>
    </div>
  );
};

export function SubjectStudyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
    >
      <h3 className="text-sm font-bold text-white mb-4">📚 Most Studied Subjects</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={DATA}
            margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
          >
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} unit="h" />
            <YAxis
              type="category"
              dataKey="subject"
              width={130}
              tick={{ fill: "#d1d5db", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="hours" radius={[0, 8, 8, 0]} maxBarSize={22}>
              {DATA.map((d, i) => (
                <Cell key={i} fill={d.color} fillOpacity={0.8} />
              ))}
              <LabelList
                dataKey="hours"
                position="right"
                formatter={(v) => `${v}h`}
                style={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const DATA = [
  { name: "Focused Study",     value: 75, color: "#6366f1" },
  { name: "Break Time",        value: 10, color: "#374151" },
  { name: "Exercise Recovery", value: 8,  color: "#3b82f6" },
  { name: "Alertness Games",   value: 7,  color: "#8b5cf6" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-bold">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.color }}>{payload[0].value}%</p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
    {payload.map((p) => (
      <div key={p.value} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
        <span className="text-[11px] text-gray-400">{p.value}</span>
      </div>
    ))}
  </div>
);

export function SessionPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
    >
      <h3 className="text-sm font-bold text-white mb-2">🥧 Session Activity Breakdown</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="78%"
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {DATA.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

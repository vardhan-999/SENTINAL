import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { motion } from "framer-motion";

const DATA = [
  { session: "S1",  focus: 68 },
  { session: "S2",  focus: 74 },
  { session: "S3",  focus: 71 },
  { session: "S4",  focus: 82 },
  { session: "S5",  focus: 79 },
  { session: "S6",  focus: 55 },
  { session: "S7",  focus: 88 },
  { session: "S8",  focus: 85 },
  { session: "S9",  focus: 91 },
  { session: "S10", focus: 87 },
  { session: "S11", focus: 76 },
  { session: "S12", focus: 83 },
  { session: "S13", focus: 89 },
  { session: "S14", focus: 92 },
  { session: "S15", focus: 84 },
  { session: "S16", focus: 78 },
  { session: "S17", focus: 86 },
  { session: "S18", focus: 82 },
];

const avg = Math.round(DATA.reduce((a, b) => a + b.focus, 0) / DATA.length);

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400">{label}</p>
      <p className="text-indigo-400 font-bold">{payload[0].value}% focus</p>
    </div>
  );
};

export function FocusConsistencyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.02]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">📈 Focus Score Trend</h3>
        <span className="text-xs text-gray-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-semibold text-indigo-400">
          Avg {avg}%
        </span>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="session" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[40, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <ReferenceLine y={avg} stroke="rgba(99,102,241,0.3)" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={2.5}
              dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#818cf8" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

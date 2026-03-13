import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { date: "Mon", focus: 65, alertness: 70, duration: 2 },
  { date: "Tue", focus: 78, alertness: 80, duration: 3.5 },
  { date: "Wed", focus: 72, alertness: 75, duration: 2.5 },
  { date: "Thu", focus: 85, alertness: 90, duration: 4 },
  { date: "Fri", focus: 82, alertness: 85, duration: 3 },
  { date: "Sat", focus: 90, alertness: 95, duration: 5 },
  { date: "Sun", focus: 88, alertness: 90, duration: 4.5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e121d] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-gray-200 font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm max-w-[150px]">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400 flex-1">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function FocusAnalyticsChart() {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col h-full border border-white/5 bg-white/[0.02]">
      <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Focus Analytics
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </h2>
          <p className="text-sm text-gray-400 mt-1">Weekly focus and alertness tracking</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent", stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            
            <Line
              type="monotone"
              dataKey="focus"
              name="Focus Score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#1e1b4b", stroke: "#6366f1", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff" }}
              animationDuration={2000}
            />
            <Line
              type="monotone"
              dataKey="alertness"
              name="Alertness Level"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#064e3b", stroke: "#10b981", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#fff" }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend built out custom for styling */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span className="text-gray-300">Focus Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-gray-300">Alertness Level</span>
        </div>
      </div>
    </div>
  );
}

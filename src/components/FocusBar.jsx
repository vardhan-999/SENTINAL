import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis 
} from "recharts";

export function FocusBar() {
  const [data, setData] = useState(
    Array.from({ length: 50 }, (_, i) => ({ time: i, value: 50 + Math.random() * 50 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [...currentData.slice(1)];
        const lastValue = newData[newData.length - 1].value;
        const change = (Math.random() - 0.5) * 15; // Random walk
        const nextValue = Math.min(100, Math.max(40, lastValue + change));
        newData.push({ time: Date.now(), value: nextValue });
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-between px-6 max-w-7xl mx-auto gap-4">
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Live Focus Span</span>
      </div>

      <div className="flex-1 h-3/5 opacity-60 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[-20, 120]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false} // Disable recharts inherent animation to let state updates handle the flow smoothly without jumping
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-shrink-0 text-xs font-medium text-indigo-300 w-12 text-right">
        {Math.round(data[data.length - 1].value)}%
      </div>
    </div>
  );
}

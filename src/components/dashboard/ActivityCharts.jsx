import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Mon", calories: 2400 },
  { name: "Tue", calories: 2100 },
  { name: "Wed", calories: 2800 },
  { name: "Thu", calories: 2600 },
  { name: "Fri", calories: 3100 },
  { name: "Sat", calories: 2900 },
  { name: "Sun", calories: 3300 },
];

export default function ActivityCharts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-3xl glass-card"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Activity Trend</h2>
          <p className="text-sm text-muted-foreground">Calories burned this week</p>
        </div>
        <select className="bg-muted text-sm px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-blue/50 outline-none">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
            />
            <Area 
              type="monotone" 
              dataKey="calories" 
              stroke="url(#colorCalories)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCalories)" 
              activeDot={{ r: 6, fill: "#22D3EE", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

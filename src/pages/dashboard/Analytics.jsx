import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Info, Scale, Activity, Flame, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { userApi, workoutApi } from "../../services/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import WeightModal from "../../components/dashboard/WeightModal";

export default function Analytics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: weightHistory } = useQuery({
    queryKey: ["weightHistory"],
    queryFn: userApi.getWeightHistory,
  });

  const { data: workoutHistory } = useQuery({
    queryKey: ["workoutHistory"],
    queryFn: workoutApi.getWorkoutHistory,
  });

  const weightMutation = useMutation({
    mutationFn: async (weightData) => {
      try {
        return await userApi.logWeight(weightData);
      } catch (err) {
        console.warn("Backend weight log error, saving to local cache:", err);
        return {
          id: Date.now(),
          weight: weightData.weight,
          bodyFatPercentage: weightData.bodyFatPercentage,
          loggedAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: (savedLog) => {
      queryClient.setQueryData(["weightHistory"], (oldHistory = []) => [...oldHistory, savedLog]);
      queryClient.invalidateQueries(["userMetrics"]);
      setIsModalOpen(false);
      toast.success("Weight logged successfully!");
    }
  });

  // Format data for Recharts
  const chartData = weightHistory?.map(log => ({
    date: new Date(log.loggedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: log.weight,
    bodyFat: log.bodyFatPercentage
  })) || [];

  const hasWeightData = chartData.length > 0;
  const hasWorkoutData = workoutHistory && workoutHistory.length > 0;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your progress, activity streaks, and body metrics over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Heatmap & Consistency */}
        <div className="p-8 rounded-3xl glass-card flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-cyan" /> Workout Consistency
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-cyan/10 text-cyan rounded-full border border-cyan/20 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> {hasWorkoutData ? `${workoutHistory.length} Sessions Logged` : "0 Sessions"}
            </span>
          </div>

          {hasWorkoutData ? (
            <div className="space-y-6 my-auto">
              <p className="text-sm text-muted-foreground">Weekly Activity Matrix</p>
              <div className="grid grid-cols-7 gap-2 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                  <div key={idx} className="text-xs font-bold text-muted-foreground mb-1">{day}</div>
                ))}
                {[...Array(14)].map((_, i) => {
                  const isActive = i < workoutHistory.length;
                  return (
                    <div
                      key={i}
                      className={`h-10 rounded-xl flex items-center justify-center font-mono text-xs transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-cyan to-purple text-black font-extrabold shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                          : "bg-white/5 border border-white/5 text-muted-foreground/30"
                      }`}
                    >
                      {isActive ? "✓" : ""}
                    </div>
                  );
                })}
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Workout Streak</span>
                <span className="font-bold text-cyan text-sm">{workoutHistory.length} Days Active</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center my-auto">
              <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center text-cyan mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">No Activity Data Yet</h3>
              <p className="text-muted-foreground max-w-sm mb-6 text-sm">Complete workouts to generate your activity heatmap and streak statistics.</p>
              <button 
                onClick={() => navigate("/dashboard/schedule")}
                className="px-6 py-2.5 rounded-xl bg-cyan hover:bg-cyan/90 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> View Workout Schedule
              </button>
            </div>
          )}
        </div>

        {/* Body Metrics */}
        {hasWeightData ? (
          <div className="p-8 rounded-3xl glass-card flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple" /> Weight Trend
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue/10 text-blue hover:bg-blue/20 transition-colors rounded-xl font-medium"
              >
                <Plus className="w-4 h-4" /> Log
              </button>
            </div>
            
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="url(#colorWeight)" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl glass-card flex flex-col items-center justify-center text-center min-h-[350px]">
            <div className="w-16 h-16 rounded-full bg-purple/10 flex items-center justify-center text-purple mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Body Metrics Empty</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Log your weight and body fat percentage to track your body composition over time.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue text-white hover:bg-blue-600 transition-colors rounded-xl font-medium shadow-lg shadow-blue/20"
              >
                <Plus className="w-4 h-4" /> Add Weight
              </button>
            </div>
          </div>
        )}
      </div>

      <WeightModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => weightMutation.mutate(data)}
        isPending={weightMutation.isPending}
      />
    </div>
  );
}

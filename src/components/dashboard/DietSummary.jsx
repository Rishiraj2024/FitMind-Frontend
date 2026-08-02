import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dietApi } from "../../services/api";
import { Utensils } from "lucide-react";

export default function DietSummary() {
  const navigate = useNavigate();
  const { data: dietData } = useQuery({
    queryKey: ["todayDiet"],
    queryFn: dietApi.getTodayDiet,
  });

  const nutrition = dietData?.todayNutrition || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
  };

  const targetCalories = 2200;
  const remainingCalories = Math.max(0, targetCalories - (nutrition.totalCalories || 0));

  const macros = [
    { name: "Protein", current: nutrition.totalProtein || 0, target: 160, color: "bg-cyan", ring: "ring-cyan/30" },
    { name: "Carbs", current: nutrition.totalCarbs || 0, target: 250, color: "bg-purple", ring: "ring-purple/30" },
    { name: "Fats", current: nutrition.totalFats || 0, target: 65, color: "bg-amber-400", ring: "ring-amber-400/30" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-3xl glass-card flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-lg font-black flex items-center gap-2 text-foreground">
            <Utensils className="w-5 h-5 text-cyan" /> Nutrition Summary
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Live macros & calories today</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-cyan">{remainingCalories}</span>
          <span className="text-xs text-muted-foreground ml-1 font-semibold">kcal left</span>
        </div>
      </div>

      <div className="space-y-4">
        {macros.map((macro, i) => {
          const percentage = Math.min(100, Math.round((macro.current / macro.target) * 100));
          return (
            <div key={macro.name} className="relative">
              <div className="flex justify-between text-xs mb-1.5 font-bold">
                <span className="text-foreground">{macro.name}</span>
                <span className="text-muted-foreground font-semibold">{macro.current}g / {macro.target}g</span>
              </div>
              <div className={`w-full h-2 rounded-full bg-muted ring-1 ring-border ${macro.ring}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${macro.color}`} 
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/dashboard/diet")}
        className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan via-blue-500 to-purple text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        View Full Diet Plan & Log Meals →
      </button>
    </motion.div>
  );
}

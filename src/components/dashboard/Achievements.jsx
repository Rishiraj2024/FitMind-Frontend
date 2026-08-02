import { motion } from "framer-motion";
import { Trophy, Medal, Target, Star, Flame, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../services/api";

const ICON_MAP = {
  "Trophy": Trophy,
  "Star": Star,
  "Medal": Medal,
  "Zap": Zap,
  "Target": Target,
  "Flame": Flame
};

export default function Achievements() {
  const navigate = useNavigate();
  const { data: userAchievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: userApi.getAchievements,
  });

  const defaultBadges = [
    { title: "First Login", icon: "Star", unlocked: true },
    { title: "Goal Crusher", icon: "Target", unlocked: userAchievements && userAchievements.length > 0 },
    { title: "First Workout", icon: "Flame", unlocked: userAchievements && userAchievements.length > 1 },
    { title: "Pro Athlete", icon: "Trophy", unlocked: false },
  ];

  const badgesToDisplay = userAchievements && userAchievements.length > 0
    ? userAchievements.slice(0, 4).map(a => ({ title: a.title, icon: a.icon, unlocked: true }))
    : defaultBadges;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-3xl glass-card flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Achievements
        </h2>
        <button 
          onClick={() => navigate("/dashboard/achievements")}
          className="text-xs font-bold text-cyan hover:underline"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {badgesToDisplay.map((item, i) => {
          const IconComponent = ICON_MAP[item.icon] || Trophy;
          return (
            <motion.div 
              key={i}
              onClick={() => navigate("/dashboard/achievements")}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all ${
                item.unlocked 
                  ? "bg-amber-400/10 border border-amber-400/30 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
                  : "bg-white/5 border border-white/5 text-muted-foreground/30 grayscale"
              }`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-center text-muted-foreground leading-tight truncate w-full">
                {item.title}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

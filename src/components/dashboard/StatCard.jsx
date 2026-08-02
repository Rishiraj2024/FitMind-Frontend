import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, colorClass, delay = 0, path, onClick }) {
  const isPositive = trend === "up";
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      className={`p-5 rounded-2xl glass-card relative overflow-hidden group ${(onClick || path) ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${colorClass.replace("text-", "")}/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass} shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_currentColor] transition-shadow duration-500`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${isPositive ? "text-success bg-success/10" : "text-danger bg-danger/10"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

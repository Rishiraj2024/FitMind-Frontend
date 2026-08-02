import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Flame, HeartPulse, Droplets, Scale, Calculator } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import AICoachPanel from "../components/dashboard/AICoachPanel";
import ActivityCharts from "../components/dashboard/ActivityCharts";
import TodayWorkoutCard from "../components/dashboard/TodayWorkoutCard";
import DietSummary from "../components/dashboard/DietSummary";
import Achievements from "../components/dashboard/Achievements";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statCards = [
    { title: "Calories Burned", value: "850", icon: Flame, trend: "up", trendValue: "+12%", color: "text-orange-500" },
    { title: "Current Weight", value: "78 kg", icon: Scale, trend: "down", trendValue: "-0.5kg", color: "text-blue" },
    { title: "BMI", value: "22.4", icon: Calculator, color: "text-purple" },
    { title: "Heart Rate", value: "72 bpm", icon: HeartPulse, color: "text-danger" },
    { title: "Water Intake", value: "2.1 L", icon: Droplets, trend: "up", trendValue: "+0.4L", color: "text-blue-400" },
    { title: "Workout Streak", value: "4 Days", icon: Activity, trend: "up", trendValue: "Personal Best", color: "text-success" },
  ];

  return (
    <DashboardLayout onLogout={handleLogout}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, {user?.firstName || "Athlete"}!
        </h1>
        <p className="text-muted-foreground text-sm">
          Here's your fitness overview for today. You're doing great!
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column (Main Content) - Takes 8 columns on large screens */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map((stat, i) => (
              <StatCard 
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                trendValue={stat.trendValue}
                colorClass={stat.color}
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* Activity Chart */}
          <ActivityCharts />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DietSummary />
            <Achievements />
          </div>
        </div>

        {/* Right Column (Sidebar Content) - Takes 4 columns on large screens */}
        <div className="xl:col-span-4 space-y-6 flex flex-col h-full">
          <div className="flex-none">
            <TodayWorkoutCard />
          </div>
          <div className="flex-1 min-h-[400px]">
            <AICoachPanel />
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}

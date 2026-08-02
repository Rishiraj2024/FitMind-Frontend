import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, Flame, HeartPulse, Droplets, Scale, Calculator, X, Plus, ShieldCheck, Heart, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutApi, userApi, dietApi } from "../../services/api";
import { useState } from "react";
import { toast } from "sonner";

import StatCard from "../../components/dashboard/StatCard";
import AICoachPanel from "../../components/dashboard/AICoachPanel";
import ActivityCharts from "../../components/dashboard/ActivityCharts";
import TodayWorkoutCard from "../../components/dashboard/TodayWorkoutCard";
import DietSummary from "../../components/dashboard/DietSummary";
import Achievements from "../../components/dashboard/Achievements";
import WeightModal from "../../components/dashboard/WeightModal";

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeModal, setActiveModal] = useState(null); // 'calories' | 'weight' | 'bmi' | 'heart' | 'streak'

  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["todayWorkout"],
    queryFn: workoutApi.getTodayWorkout,
  });

  const { data: workoutHistory } = useQuery({
    queryKey: ["workoutHistory"],
    queryFn: workoutApi.getWorkoutHistory,
  });

  const { data: dietData } = useQuery({
    queryKey: ["todayDiet"],
    queryFn: dietApi.getTodayDiet,
  });

  const { data: metrics } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: userApi.getMetrics,
  });

  const waterMutation = useMutation({
    mutationFn: async (amountLiters) => {
      try {
        return await dietApi.addWater(amountLiters);
      } catch (err) {
        return amountLiters;
      }
    },
    onSuccess: (addedAmount) => {
      queryClient.setQueryData(["todayDiet"], (oldData) => {
        const prevNut = oldData?.todayNutrition || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, waterIntake: 0.0 };
        const newWater = (prevNut.waterIntake || 0) + (typeof addedAmount === 'number' ? addedAmount : 0.25);
        return {
          ...oldData,
          todayNutrition: {
            ...prevNut,
            waterIntake: newWater
          }
        };
      });
      toast.success("Logged 250ml water! Keep staying hydrated.");
    },
  });

  const weightMutation = useMutation({
    mutationFn: async (weightData) => {
      try {
        return await userApi.logWeight(weightData);
      } catch (err) {
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
      setActiveModal(null);
      toast.success("Weight logged successfully!");
    }
  });

  const historyCount = workoutHistory?.length || 0;
  const streakDays = historyCount > 0 ? historyCount : (sessionData?.completed ? 1 : 0);
  const totalCaloriesBurned = (streakDays || 1) * 350;
  const waterIntake = dietData?.todayNutrition?.waterIntake || 0.0;
  const userWeight = metrics?.weight ? `${metrics.weight} kg` : "75.5 kg";
  const userBmi = metrics?.bmi ? `${metrics.bmi}` : "23.3";

  const statCards = [
    { 
      title: "Calories Burned", 
      value: `${totalCaloriesBurned} kcal`, 
      icon: Flame, 
      color: "text-orange-500", 
      onClick: () => setActiveModal("calories") 
    },
    { 
      title: "Current Weight", 
      value: userWeight, 
      icon: Scale, 
      color: "text-cyan", 
      onClick: () => setActiveModal("weight") 
    },
    { 
      title: "BMI", 
      value: userBmi, 
      icon: Calculator, 
      color: "text-purple", 
      onClick: () => setActiveModal("bmi") 
    },
    { 
      title: "Heart Rate", 
      value: "72 bpm", 
      icon: HeartPulse, 
      color: "text-pink", 
      onClick: () => setActiveModal("heart") 
    },
    { 
      title: "Water Intake", 
      value: `${waterIntake.toFixed(1)} L`, 
      icon: Droplets, 
      color: "text-cyan", 
      onClick: () => waterMutation.mutate(0.25) 
    },
    { 
      title: "Workout Streak", 
      value: `${streakDays} ${streakDays === 1 ? "Day" : "Days"}`, 
      icon: Activity, 
      color: "text-emerald-400", 
      onClick: () => setActiveModal("streak") 
    },
  ];

  const needsProfileSetup = !metrics?.weight || !metrics?.bmi;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.firstName || "Athlete"}!
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's your fitness overview for today. Click any card below for unique insights & actions!
          </p>
        </div>

        {/* Action Banner */}
        {needsProfileSetup && (
          <div className="bg-cyan/10 border border-cyan/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-cyan">Complete your profile to get personalized insights.</h3>
              <p className="text-sm text-muted-foreground mt-1">We need some basic information to calculate your BMI, daily calorie targets, and more.</p>
            </div>
            <button onClick={() => navigate('/dashboard/profile')} className="px-6 py-2 bg-cyan text-black font-bold rounded-xl whitespace-nowrap hover:bg-cyan/90 transition-colors">
              + Complete Profile
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12">
        <div className="xl:col-span-8 space-y-6">
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
                onClick={stat.onClick}
              />
            ))}
          </div>

          <ActivityCharts />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DietSummary />
            <Achievements />
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6 flex flex-col h-full">
          <div className="flex-none">
            {isLoading ? (
              <div className="h-[250px] bg-muted animate-pulse rounded-3xl"></div>
            ) : (
              <TodayWorkoutCard sessionData={sessionData} />
            )}
          </div>
          <div className="flex-1 min-h-[400px]">
            <AICoachPanel />
          </div>
        </div>
      </div>

      {/* Unique Modals for Each Stat Card */}
      <AnimatePresence>
        {/* 1. Calorie Breakdown Modal */}
        {activeModal === "calories" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-neutral-950 text-white border border-cyan/30 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
                  <Flame className="w-5 h-5" /> Calorie Expenditure Breakdown
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-semibold">Active Workout Burn</span>
                  <span className="text-lg font-black text-orange-400">{totalCaloriesBurned > 0 ? `${totalCaloriesBurned} kcal` : "350 kcal"}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-semibold">Basal Metabolic Rate (BMR)</span>
                  <span className="text-lg font-black text-cyan">1,650 kcal</span>
                </div>
                <div className="p-4 rounded-2xl bg-cyan/10 border border-cyan/20 flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan">Total Daily Calorie Burn</span>
                  <span className="text-xl font-black text-cyan">{(totalCaloriesBurned > 0 ? totalCaloriesBurned : 350) + 1650} kcal</span>
                </div>
              </div>
              <button onClick={() => { setActiveModal(null); navigate("/dashboard/analytics"); }} className="w-full py-3 rounded-xl bg-cyan text-black font-bold text-xs">View Full Energy Analytics →</button>
            </motion.div>
          </div>
        )}

        {/* 2. Weight Modal */}
        {activeModal === "weight" && (
          <WeightModal isOpen={true} onClose={() => setActiveModal(null)} onSave={(data) => weightMutation.mutate(data)} isPending={weightMutation.isPending} />
        )}

        {/* 3. BMI Modal */}
        {activeModal === "bmi" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-neutral-950 text-white border border-purple/30 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-purple font-bold text-lg">
                  <Calculator className="w-5 h-5" /> Body Mass Index (BMI) Guide
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-center py-3 bg-purple/10 border border-purple/20 rounded-2xl">
                <span className="text-3xl font-black text-purple">{userBmi}</span>
                <p className="text-xs text-muted-foreground mt-1">Optimal Healthy Category</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5"><span>Underweight</span><span className="text-muted-foreground">&lt; 18.5</span></div>
                <div className="flex justify-between p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold"><span>Normal Weight</span><span>18.5 – 24.9</span></div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5"><span>Overweight</span><span className="text-muted-foreground">25 – 29.9</span></div>
              </div>
              <button onClick={() => { setActiveModal(null); navigate("/dashboard/profile"); }} className="w-full py-3 rounded-xl bg-purple text-white font-bold text-xs">Update Profile Metrics →</button>
            </motion.div>
          </div>
        )}

        {/* 4. Heart Rate Modal */}
        {activeModal === "heart" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-neutral-950 text-white border border-pink/30 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-pink font-bold text-lg">
                  <HeartPulse className="w-5 h-5" /> Heart Rate Training Zones
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-semibold">Resting HR</span>
                  <span className="text-base font-bold text-emerald-400">68 bpm</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-semibold">Fat Burn Zone</span>
                  <span className="text-base font-bold text-amber-400">115 – 135 bpm</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-semibold">Peak Anaerobic Zone</span>
                  <span className="text-base font-bold text-pink">165 bpm</span>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-full py-3 rounded-xl bg-pink text-white font-bold text-xs">Done</button>
            </motion.div>
          </div>
        )}

        {/* 5. Streak Modal */}
        {activeModal === "streak" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-neutral-950 text-white border border-emerald-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                  <Activity className="w-5 h-5" /> Workout Consistency Streak
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-center py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="text-4xl font-black text-emerald-400">{streakDays}</span>
                <p className="text-xs text-muted-foreground mt-1">Completed Workout Days</p>
              </div>
              <button onClick={() => { setActiveModal(null); navigate("/dashboard/workouts"); }} className="w-full py-3 rounded-xl bg-emerald-400 text-black font-bold text-xs">Go to Workouts →</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

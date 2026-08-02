import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Medal, Zap, Target, Flame, Plus, X, CheckCircle2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  const queryClient = useQueryClient();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Workout");
  const [targetDate, setTargetDate] = useState("");

  const [userGoals, setUserGoals] = useState([
    { id: 1, title: "Bench Press 100kg", category: "Workout", progress: 80, completed: false },
    { id: 2, title: "Drink 3.0L Water Daily", category: "Nutrition", progress: 100, completed: true },
    { id: 3, title: "Reach 7-Day Streak", category: "Workout", progress: 60, completed: false },
  ]);

  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: userApi.getAchievements,
  });

  const claimMutation = useMutation({
    mutationFn: userApi.claimAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries(["achievements"]);
      toast.success("Achievement unlocked! Check your trophy room.");
    }
  });

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: goalTitle,
      category: goalCategory,
      progress: 0,
      completed: false,
    };
    setUserGoals((prev) => [newGoal, ...prev]);
    setGoalTitle("");
    setIsGoalModalOpen(false);
    toast.success("New Goal created! Track your progress below.");
  };

  const toggleGoalCompletion = (id) => {
    setUserGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? 50 : 100 } : g
      )
    );
    toast.success("Goal status updated!");
  };

  const handleDeleteGoal = (id) => {
    setUserGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success("Goal removed successfully!");
  };

  const handleClaim = (title, description, icon) => {
    claimMutation.mutate({ title, description, icon });
  };

  const rawAchievements = achievementsData || [
    { id: 1, title: "First Login", description: "Logged in for the first time!", icon: "Star", unlockedAt: new Date().toISOString() }
  ];

  // Deduplicate achievements by title to prevent duplicates
  const uniqueAchievements = Array.from(
    new Map(rawAchievements.map((item) => [item.title, item])).values()
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">Achievements & Goals</h1>
          <p className="text-muted-foreground text-sm font-medium">Track your fitness milestones, personal records, and active goals.</p>
        </div>
        <button 
          onClick={() => setIsGoalModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-purple text-black font-black rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          Create Goal
        </button>
      </div>

      {/* Active User Goals Section */}
      <div className="p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-cyan" /> Active Fitness Goals
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">{userGoals.filter(g => g.completed).length}/{userGoals.length} Completed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userGoals.map((goal) => (
            <div key={goal.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative group hover:border-cyan/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan/10 text-cyan">
                  {goal.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleGoalCompletion(goal.id)}
                    title="Toggle Goal Completion"
                    className={`p-1.5 rounded-lg transition-colors ${goal.completed ? "text-emerald-400 bg-emerald-500/10" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Delete Goal"
                    className="p-1.5 rounded-lg text-pink/70 hover:text-pink hover:bg-pink/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className={`font-bold text-base ${goal.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{goal.title}</h4>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${goal.completed ? "bg-emerald-400" : "bg-gradient-to-r from-cyan to-purple"}`} style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trophy Room Section */}
      <div className="p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Trophy className="w-5 h-5 text-amber-400" /> Trophy Room Badges
          </h3>
          
          {/* Milestone Claim Action Shortcuts */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleClaim("First Workout", "Crushed your first workout!", "Flame")}
              disabled={claimMutation.isPending}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan/20 border border-white/10 text-xs font-bold text-cyan transition-colors"
            >
              + Unlock Workout Badge
            </button>
            <button 
              onClick={() => handleClaim("Goal Crusher", "Achieved your first fitness milestone!", "Target")}
              disabled={claimMutation.isPending}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple/20 border border-white/10 text-xs font-bold text-purple transition-colors"
            >
              + Unlock Goal Badge
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueAchievements.map((achievement) => {
            const Icon = ICON_MAP[achievement.icon] || Trophy;
            const date = new Date(achievement.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            
            return (
              <motion.div 
                key={achievement.id || achievement.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center group hover:border-amber-400/40 transition-colors"
              >
                <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <Icon className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-lg text-foreground mb-1">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground mb-4">{achievement.description}</p>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  Unlocked on {date}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {isGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-950 text-white border border-cyan/30 rounded-3xl p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan" />
                  <h2 className="text-xl font-bold">Create New Goal</h2>
                </div>
                <button
                  onClick={() => setIsGoalModalOpen(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Goal Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bench Press 100kg or Drink 3L Water"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan"
                  >
                    <option value="Workout" className="bg-neutral-900">Workout</option>
                    <option value="Nutrition" className="bg-neutral-900">Nutrition</option>
                    <option value="Weight" className="bg-neutral-900">Weight</option>
                    <option value="Endurance" className="bg-neutral-900">Endurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-cyan text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan/90 transition-all mt-4"
                >
                  Save Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

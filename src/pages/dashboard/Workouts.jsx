import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { workoutApi } from "../../services/api";
import { Calendar, Dumbbell, History, Search, Filter, Play, CheckCircle2 } from "lucide-react";
import ActiveWorkoutSession from "../../components/dashboard/ActiveWorkoutSession";

export default function Workouts() {
  const [activeTab, setActiveTab] = useState("program");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("Empty Workout");

  const { data: exercises, isLoading: loadingExercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: workoutApi.getExercises,
  });

  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ["workoutHistory"],
    queryFn: workoutApi.getWorkoutHistory,
  });

  const tabs = [
    { id: "program", label: "Active Program", icon: Calendar },
    { id: "history", label: "History", icon: History },
    { id: "library", label: "Exercise Library", icon: Dumbbell },
  ];

  const handleStartWorkout = (title = "Empty Workout") => {
    setSessionTitle(title);
    setIsSessionOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Workouts</h1>
          <p className="text-muted-foreground">Manage your training, view live history, and log sessions in real time.</p>
        </div>
        <button 
          onClick={() => handleStartWorkout("Empty Workout")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-purple text-white rounded-full font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Empty Workout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-muted/50 rounded-2xl w-full md:w-fit border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors z-10 ${
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="workout-tab-indicator"
                className="absolute inset-0 bg-background rounded-xl border border-border shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "program" && (
            <motion.div
              key="program"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 rounded-3xl glass-card flex flex-col items-center justify-center text-center min-h-[400px]"
            >
              <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center text-cyan mb-4">
                <Dumbbell className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Hypertrophy & Strength Program</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">4-Week Progressive Overload Program designed for muscle building and strength gains.</p>
              <button 
                onClick={() => handleStartWorkout("Hypertrophy Session")}
                className="px-6 py-3 rounded-2xl bg-cyan hover:bg-cyan/90 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                <Play className="w-4 h-4 fill-current" /> Start Today's Program Session
              </button>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {loadingHistory ? (
                <div className="h-64 animate-pulse bg-muted rounded-3xl"></div>
              ) : history?.length === 0 ? (
                <div className="p-8 rounded-3xl glass-card flex flex-col items-center justify-center text-center min-h-[400px]">
                  <p className="text-muted-foreground">No completed workouts found. Click "Start Empty Workout" to log your first real session!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {history?.map((session) => (
                    <div key={session.id} className="p-6 rounded-2xl glass-card space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-white">{session.programName || "Custom Workout"}</h4>
                          <p className="text-xs text-cyan mt-0.5">{new Date(session.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {session.sessionNotes || "Completed"}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </div>
                      </div>

                      {session.logs && session.logs.length > 0 && (
                        <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {session.logs.map((log, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                              <p className="font-bold text-white truncate">{log.exercise?.name || "Exercise"}</p>
                              <p className="text-muted-foreground">{log.setsCompleted || 1} set(s) × {log.repsCompleted} reps @ <span className="text-cyan font-semibold">{log.weightUsed} kg</span></p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "library" && (
            <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all"
                  />
                </div>
                <button className="px-4 py-3 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center gap-2 font-medium">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              {loadingExercises ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-40 animate-pulse bg-muted rounded-3xl"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises?.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())).map((exercise) => (
                    <div key={exercise.id} className="p-6 rounded-3xl glass-card group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                          <Dumbbell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-muted rounded-md uppercase tracking-wider">{exercise.targetMuscle}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-1">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Workout Session Full-screen Overlay Modal */}
      <ActiveWorkoutSession
        isOpen={isSessionOpen}
        onClose={() => setIsSessionOpen(false)}
        initialProgramName={sessionTitle}
      />
    </div>
  );
}

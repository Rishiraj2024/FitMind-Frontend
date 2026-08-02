import { motion } from "framer-motion";
import { Play, Clock, Dumbbell, CheckCircle2, Award } from "lucide-react";
import { useState } from "react";
import ActiveWorkoutSession from "./ActiveWorkoutSession";

export default function TodayWorkoutCard({ sessionData }) {
  const [isSessionOpen, setIsSessionOpen] = useState(false);

  const activeSession = sessionData || {
    programName: "Heavy Legs Session",
    completed: false,
    sessionNotes: "Scheduled for today",
    logs: []
  };

  const totalExercises = activeSession.logs?.length || 0;
  const totalVolume = activeSession.logs?.reduce((acc, log) => acc + (log.weightUsed * log.repsCompleted), 0) || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-3xl glass-card group hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between"
      >
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan/10 rounded-full blur-3xl group-hover:bg-cyan/20 transition-colors duration-500"></div>

        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              {activeSession.completed ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-3 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed Today
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/20 text-xs font-bold mb-3 uppercase tracking-wider">
                  Up Next
                </div>
              )}
              <h2 className="text-2xl font-black text-white tracking-tight">{activeSession.programName || "Custom Workout"}</h2>
              <p className="text-muted-foreground text-xs mt-1">{activeSession.sessionNotes || "Daily training target"}</p>
            </div>
            
            <button 
              onClick={() => setIsSessionOpen(true)}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan to-purple text-white flex items-center justify-center shadow-lg shadow-cyan/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col gap-0.5 p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Exercises</span>
              <span className="font-extrabold text-white text-sm flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-cyan" /> {totalExercises > 0 ? totalExercises : "Recommended"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Volume</span>
              <span className="font-extrabold text-cyan text-sm">{totalVolume > 0 ? `${totalVolume} kg` : "-- kg"}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Status</span>
              <span className={`font-extrabold text-sm ${activeSession.completed ? "text-emerald-400" : "text-amber-400"}`}>
                {activeSession.completed ? "Finished" : "Ready"}
              </span>
            </div>
          </div>

          {activeSession.logs && activeSession.logs.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Logged Exercises</p>
              <div className="flex flex-wrap gap-1.5">
                {activeSession.logs.map((log, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-white font-medium">
                    {log.exercise?.name || "Exercise"} ({log.weightUsed}kg × {log.repsCompleted})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSessionOpen(true)}
          className="mt-4 w-full py-2.5 rounded-xl bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-xs font-bold text-cyan transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> {activeSession.completed ? "Log Another Workout Session" : "Start Active Workout Session"}
        </button>
      </motion.div>

      <ActiveWorkoutSession
        isOpen={isSessionOpen}
        onClose={() => setIsSessionOpen(false)}
        initialProgramName={activeSession.programName || "Heavy Legs Session"}
      />
    </>
  );
}

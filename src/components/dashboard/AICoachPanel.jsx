import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Zap, ArrowRight, Activity, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ActiveWorkoutSession from "./ActiveWorkoutSession";

export default function AICoachPanel() {
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-cyan/90 to-purple/90 p-6 text-white shadow-xl shadow-cyan/20 relative overflow-hidden h-full flex flex-col hover:shadow-cyan/40 hover:-translate-y-1 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Coach</h2>
            <p className="text-blue-100 text-sm">Always analyzing.</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 relative z-10">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-bold">Recovery Score</span>
              <span className="text-sm font-black text-emerald-400 flex items-center gap-1"><Activity className="w-3.5 h-3.5"/> 92%</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-2 mb-3">
              <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ width: "92%" }}></div>
            </div>
            <p className="text-sm leading-relaxed text-white font-medium">
              Your HRV is excellent today. You're fully recovered and primed for a high-intensity session. I recommend tackling your Heavy Legs day!
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-inner">
             <h3 className="text-sm text-amber-300 font-bold mb-2 flex items-center gap-2">
               <Zap className="w-4 h-4 text-amber-300" /> Pro Tip
             </h3>
             <p className="text-sm leading-relaxed text-white font-medium">
               Try increasing your protein intake by 15g post-workout to optimize muscle synthesis based on your recent fatigue levels.
             </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 relative z-10">
          <button 
            onClick={() => {
              toast.success("Launching Heavy Legs Session!");
              setIsSessionOpen(true);
            }}
            className="w-full bg-black text-white hover:bg-neutral-900 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all border border-white/20 shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Recommended Workout
            <ArrowRight className="w-4 h-4 text-cyan" />
          </button>

          <button 
            onClick={() => navigate("/dashboard/resources")}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/20"
          >
            <BookOpen className="w-4 h-4 text-cyan" /> Learn Workout Technique Guides →
          </button>
        </div>
      </motion.div>

      <ActiveWorkoutSession
        isOpen={isSessionOpen}
        onClose={() => setIsSessionOpen(false)}
        initialProgramName="Heavy Legs Session"
      />
    </>
  );
}

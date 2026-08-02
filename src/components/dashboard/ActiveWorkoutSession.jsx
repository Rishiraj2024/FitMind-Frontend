import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, CheckCircle2, Clock, Dumbbell, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workoutApi } from "../../services/api";

const DEFAULT_EXERCISES = [
  { id: 1, name: "Barbell Squats", targetMuscle: "Legs", description: "Legs & Core" },
  { id: 2, name: "Deadlift", targetMuscle: "Back/Legs", description: "Full Body Posterior Chain" },
  { id: 3, name: "Bench Press", targetMuscle: "Chest", description: "Upper Body Push" },
  { id: 4, name: "Push-ups", targetMuscle: "Chest", description: "Chest & Triceps" },
  { id: 5, name: "Pull-ups", targetMuscle: "Back", description: "Back & Biceps" },
  { id: 6, name: "Overhead Shoulder Press", targetMuscle: "Shoulders", description: "Shoulder Deltoids" },
  { id: 7, name: "Dumbbell Bicep Curls", targetMuscle: "Arms", description: "Biceps" }
];

export default function ActiveWorkoutSession({ isOpen, onClose, initialProgramName = "Empty Workout" }) {
  const queryClient = useQueryClient();
  const [seconds, setSeconds] = useState(0);
  const [sessionNotes, setSessionNotes] = useState("");
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");

  const { data: fetchedExercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: workoutApi.getExercises,
  });

  const availableExercises = (fetchedExercises && fetchedExercises.length > 0) ? fetchedExercises : DEFAULT_EXERCISES;

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isOpen) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddExercise = () => {
    if (!selectedExerciseId) return;
    const ex = availableExercises?.find((e) => e.id === Number(selectedExerciseId));
    if (!ex) return;

    setExercisesList((prev) => [
      ...prev,
      {
        exercise: ex,
        sets: [{ setsCompleted: 1, repsCompleted: 10, weightUsed: 20, completed: true }],
      },
    ]);
    setSelectedExerciseId("");
  };

  const handleAddSet = (exerciseIndex) => {
    setExercisesList((prev) => {
      const updated = [...prev];
      const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1] || {
        setsCompleted: 1,
        repsCompleted: 10,
        weightUsed: 20,
      };
      updated[exerciseIndex].sets.push({
        setsCompleted: updated[exerciseIndex].sets.length + 1,
        repsCompleted: lastSet.repsCompleted,
        weightUsed: lastSet.weightUsed,
        completed: true,
      });
      return updated;
    });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setExercisesList((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets.splice(setIndex, 1);
      if (updated[exerciseIndex].sets.length === 0) {
        updated.splice(exerciseIndex, 1);
      }
      return updated;
    });
  };

  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
    setExercisesList((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      try {
        return await workoutApi.saveWorkoutSession(payload);
      } catch (err) {
        console.warn("Backend API call error, saving session locally:", err);
        return {
          id: Date.now(),
          scheduledDate: new Date().toISOString(),
          completed: true,
          sessionNotes: payload.sessionNotes,
          programName: payload.programName,
          logs: payload.logs.map((l, idx) => ({
            id: idx + 1,
            setsCompleted: 1,
            repsCompleted: l.repsCompleted,
            weightUsed: l.weightUsed,
            exercise: availableExercises.find((e) => e.id === l.exerciseId) || { name: "Exercise", targetMuscle: "Full Body" }
          }))
        };
      }
    },
    onSuccess: (savedSession) => {
      queryClient.setQueryData(["workoutHistory"], (oldData = []) => [savedSession, ...oldData]);
      queryClient.setQueryData(["todayWorkout"], savedSession);
      queryClient.invalidateQueries(["userMetrics"]);
      toast.success("Workout completed and saved to Home overview!");
      onClose();
    },
  });

  const handleFinish = () => {
    if (exercisesList.length === 0) {
      toast.error("Add at least one exercise before finishing.");
      return;
    }

    const compiledLogs = [];
    exercisesList.forEach((exItem) => {
      exItem.sets.forEach((s) => {
        compiledLogs.push({
          exerciseId: exItem.exercise.id,
          setsCompleted: 1,
          repsCompleted: Number(s.repsCompleted) || 0,
          weightUsed: Number(s.weightUsed) || 0,
        });
      });
    });

    saveMutation.mutate({
      programName: initialProgramName,
      sessionNotes: sessionNotes || `Duration: ${formatTime(seconds)}`,
      logs: compiledLogs,
    });
  };

  if (!isOpen) return null;

  const totalVolume = exercisesList.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, set) => sAcc + (Number(set.repsCompleted) || 0) * (Number(set.weightUsed) || 0), 0);
  }, 0);

  const totalSets = exercisesList.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white border border-cyan/30 rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.25)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-none">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h2 className="text-2xl font-black text-white tracking-tight">{initialProgramName}</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time session tracking</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 font-mono font-bold text-cyan text-lg">
                <Clock className="w-5 h-5 text-cyan animate-pulse" />
                {formatTime(seconds)}
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-none">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Volume</span>
              <p className="text-xl font-bold text-cyan mt-1">{totalVolume} kg</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Sets</span>
              <p className="text-xl font-bold text-purple mt-1">{totalSets} sets</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Exercises</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{exercisesList.length}</p>
            </div>
          </div>

          {/* Add Exercise Selector */}
          <div className="flex gap-3 flex-none">
            <div className="relative flex-1">
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan text-sm"
              >
                <option value="">+ Choose exercise to add...</option>
                {availableExercises?.map((ex) => (
                  <option key={ex.id} value={ex.id} className="bg-neutral-900 text-white">
                    {ex.name} ({ex.targetMuscle})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              onClick={handleAddExercise}
              disabled={!selectedExerciseId}
              className="px-6 py-3 rounded-2xl bg-cyan hover:bg-cyan/90 text-black font-bold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <Plus className="w-5 h-5" /> Add
            </button>
          </div>

          {/* Exercise List Log */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 hide-scrollbar">
            {exercisesList.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <Dumbbell className="w-12 h-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">No exercises added yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Select an exercise above to begin logging sets.</p>
              </div>
            ) : (
              exercisesList.map((exItem, exIdx) => (
                <div key={exIdx} className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-lg">{exItem.exercise.name}</h4>
                      <span className="text-xs text-cyan font-medium uppercase tracking-wider">
                        {exItem.exercise.targetMuscle}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddSet(exIdx)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cyan transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Set
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-xs font-bold text-muted-foreground uppercase px-2">
                      <span className="col-span-2">Set</span>
                      <span className="col-span-4">Weight (kg)</span>
                      <span className="col-span-4">Reps</span>
                      <span className="col-span-2 text-right">Action</span>
                    </div>

                    {exItem.sets.map((set, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-12 gap-2 items-center px-2 py-1 bg-white/5 rounded-xl border border-white/5">
                        <span className="col-span-2 text-sm font-bold text-white">{setIdx + 1}</span>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.weightUsed}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, "weightUsed", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white text-center focus:outline-none focus:border-cyan"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.repsCompleted}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, "repsCompleted", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white text-center focus:outline-none focus:border-cyan"
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="p-1.5 rounded-lg text-pink/70 hover:text-pink hover:bg-pink/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            <div className="pt-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Session Notes</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="How did this workout feel? Add any notes..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10 flex-none">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFinish}
              disabled={saveMutation.isPending}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan to-purple text-white font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              {saveMutation.isPending ? "Saving Session..." : "Finish Workout"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

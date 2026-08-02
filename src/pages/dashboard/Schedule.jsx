import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Clock, PlayCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workoutApi } from "../../services/api";
import ScheduleModal from "../../components/dashboard/ScheduleModal";

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: scheduledWorkouts, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: workoutApi.getSchedule,
  });

  const scheduleMutation = useMutation({
    mutationFn: workoutApi.scheduleWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries(["schedule"]);
      setIsModalOpen(false);
      toast.success("Workout scheduled successfully!");
    }
  });

  const upcomingWorkouts = scheduledWorkouts || [];
  const hasWorkouts = upcomingWorkouts.length > 0;
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Schedule</h1>
          <p className="text-muted-foreground">Manage your upcoming workouts and training blocks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue text-white hover:bg-blue-600 transition-colors rounded-xl font-medium shadow-lg shadow-blue/20"
        >
          <Plus className="w-4 h-4" /> Plan Workout
        </button>
      </div>

      <div className="p-8 rounded-3xl glass-card flex flex-col min-h-[400px]">
        {hasWorkouts ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Upcoming Workouts</h3>
            <div className="space-y-4">
              {upcomingWorkouts.map((workout, index) => {
                const date = new Date(workout.scheduledDate);
                const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={workout.id} className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center text-blue">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{workout.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {day}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-purple/10 text-purple rounded-full text-xs font-bold uppercase tracking-wider">
                        {workout.type}
                      </span>
                      <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan hover:border-cyan hover:text-white transition-colors">
                        <PlayCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center flex-1">
            <div className="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Upcoming Workouts</h3>
            <p className="text-muted-foreground max-w-sm mb-6">You haven't scheduled any workouts yet. Plan your next session to stay on track.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue text-white hover:bg-blue-600 transition-colors rounded-xl font-medium shadow-lg shadow-blue/20"
            >
              <Plus className="w-4 h-4" /> Plan Your First Workout
            </button>
          </div>
        )}
      </div>

      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => scheduleMutation.mutate(data)}
        isPending={scheduleMutation.isPending}
      />
    </div>
  );
}

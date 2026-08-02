import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Save } from "lucide-react";

export default function ScheduleModal({ isOpen, onClose, onSave, isPending }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "Strength",
    date: "",
    time: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine date and time into a single ISO string for LocalDateTime backend
    const scheduledDate = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    onSave({
      title: formData.title,
      type: formData.type,
      scheduledDate: scheduledDate
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-xl z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Plan Workout</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Workout Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                placeholder="e.g. Heavy Leg Day" 
                required
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Workout Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Yoga">Yoga</option>
                <option value="Flexibility">Flexibility</option>
                <option value="HIIT">HIIT</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue/20 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isPending ? "Scheduling..." : "Schedule Workout"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

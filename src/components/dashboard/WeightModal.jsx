import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, Save } from "lucide-react";

export default function WeightModal({ isOpen, onClose, onSave, isPending }) {
  const [formData, setFormData] = useState({
    weight: "",
    bodyFatPercentage: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      weight: parseFloat(formData.weight),
      bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null
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
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Log Weight</h2>
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
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                name="weight" 
                value={formData.weight} 
                onChange={handleChange}
                placeholder="e.g. 75.5" 
                required
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Body Fat Percentage (%) - Optional</label>
              <input 
                type="number" 
                step="0.1"
                name="bodyFatPercentage" 
                value={formData.bodyFatPercentage} 
                onChange={handleChange}
                placeholder="e.g. 15.5" 
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50"
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue/20 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isPending ? "Saving..." : "Log Weight"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

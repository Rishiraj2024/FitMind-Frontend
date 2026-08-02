import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Scale, Ruler, Activity, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../../services/api";

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: ""
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      // Hardcoded default values
      return { age: 25, gender: "male", weight: 75.5, height: 180 };
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || "",
        gender: profile.gender || "",
        weight: profile.weight || "",
        height: profile.height || ""
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Hardcoded success
      return new Promise(resolve => setTimeout(() => resolve(data), 800));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      queryClient.invalidateQueries(["userMetrics"]);
      toast.success("Profile updated successfully!");
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
    });
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Profile Setup</h1>
        <p className="text-muted-foreground">Complete your profile to unlock personalized AI insights, BMI calculations, and macro targets.</p>
      </div>

      <div className="p-8 rounded-3xl glass-card relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-blue rounded-full"></div>
              <div className="w-2 h-2 bg-blue rounded-full"></div>
              <div className="w-2 h-2 bg-blue rounded-full"></div>
            </div>
          </div>
        ) : null}
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-blue" /> Personal Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 25" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50 appearance-none">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple" /> Body Metrics
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" /> Weight (kg)
                </label>
                <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 75.5" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" /> Height (cm)
                </label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 180" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/50" />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="flex justify-end items-center">
            <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 px-8 py-3 bg-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue/20 disabled:opacity-50">
              <Save className="w-5 h-5" />
              {mutation.isPending ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

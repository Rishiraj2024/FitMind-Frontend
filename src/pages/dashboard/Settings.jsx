import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, Moon } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("theme") || "dark");
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (themeMode === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [themeMode]);

  const handleThemeChange = (e) => {
    const val = e.target.value;
    setThemeMode(val);
    toast.success(`Theme set to ${val} mode`);
  };

  const handleUnitChange = (e) => {
    const val = e.target.value;
    setUnitSystem(val);
    toast.success(`Units updated to ${val}`);
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 glass-card font-medium text-cyan text-left">
            <SettingsIcon className="w-5 h-5" /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-xl font-medium text-left transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-xl font-medium text-left transition-colors">
            <Shield className="w-5 h-5" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-xl font-medium text-left transition-colors">
            <Moon className="w-5 h-5" /> Appearance
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl glass-card space-y-6">
            <h3 className="text-xl font-bold">General Preferences</h3>
            
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <h4 className="font-medium">Theme Mode</h4>
                <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <select 
                value={themeMode}
                onChange={handleThemeChange}
                className="px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-cyan text-sm appearance-none"
              >
                <option value="dark" className="bg-neutral-900">Dark Mode</option>
                <option value="light" className="bg-neutral-900">Light Mode</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <h4 className="font-medium">Measurement System</h4>
                <p className="text-sm text-muted-foreground">Metric (kg/cm) or Imperial (lbs/in)</p>
              </div>
              <select 
                value={unitSystem}
                onChange={handleUnitChange}
                className="px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:border-cyan text-sm appearance-none"
              >
                <option value="metric" className="bg-neutral-900">Metric (kg / cm)</option>
                <option value="imperial" className="bg-neutral-900">Imperial (lbs / in)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

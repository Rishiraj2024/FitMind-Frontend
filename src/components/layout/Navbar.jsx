import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Search, 
  Menu, 
  Moon,
  Sun,
  Bot,
  User,
  Settings,
  LogOut,
  CreditCard
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuClick, onOpenAICoach }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const getPageTitle = (pathname) => {
    if (pathname === "/dashboard" || pathname === "/dashboard/") return "Overview";
    if (pathname.includes("/analytics")) return "Analytics";
    if (pathname.includes("/workouts")) return "Workouts";
    if (pathname.includes("/diet")) return "Diet & Nutrition";
    if (pathname.includes("/schedule")) return "Schedule";
    if (pathname.includes("/achievements")) return "Achievements";
    if (pathname.includes("/profile")) return "Profile Setup";
    if (pathname.includes("/settings")) return "Settings";
    return "Overview";
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span>/</span>
          <span className="text-foreground font-semibold">{getPageTitle(location.pathname)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        <motion.button 
          onClick={onOpenAICoach}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan/10 text-cyan font-medium text-sm hover:bg-cyan/20 transition-colors border border-cyan/20"
        >
          <Bot className="w-4 h-4 text-cyan" />
          <span>Ask AI Coach</span>
        </motion.button>

        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors relative"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink rounded-full border-2 border-card animate-pulse"></span>
        </button>

        <div className="relative ml-2" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan to-purple flex items-center justify-center text-white font-black text-sm shadow-md hover:shadow-lg transition-all hover:scale-105">
              {user?.firstName ? user.firstName[0].toUpperCase() : "FM"}
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-60 glass-panel border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-bold text-white truncate">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "Active Athlete"}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email || "user@example.com"}</p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple/20 text-purple border border-purple/30 text-[10px] font-bold uppercase tracking-wider">
                    Pro Member
                  </div>
                </div>
                
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => handleNavigate("/dashboard/profile")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan" /> View Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      toast.success("Active Plan: FitMind Pro Membership (Unlimited AI & Workouts)");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-purple" /> Subscription
                  </button>
                  <button 
                    onClick={() => handleNavigate("/dashboard/settings")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-cyan" /> Settings
                  </button>
                </div>
                
                <div className="p-2 border-t border-white/10">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-pink/90 hover:text-pink hover:bg-pink/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

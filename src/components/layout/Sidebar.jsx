import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Activity, 
  Calendar, 
  Apple, 
  Trophy, 
  Settings, 
  LogOut,
  Dumbbell,
  BookOpen
} from "lucide-react";

const MotionNavLink = motion.create(NavLink);

export default function Sidebar({ isOpen, onLogout }) {
  const menuItems = [
    { icon: Home, label: "Overview", path: "/dashboard", end: true },
    { icon: Activity, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Dumbbell, label: "Workouts", path: "/dashboard/workouts" },
    { icon: Apple, label: "Diet Plan", path: "/dashboard/diet" },
    { icon: Calendar, label: "Schedule", path: "/dashboard/schedule" },
    { icon: Trophy, label: "Achievements", path: "/dashboard/achievements" },
    { icon: BookOpen, label: "Workout Guides", path: "/dashboard/resources" },
  ];

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed md:relative z-40 h-full w-64 glass-panel border-r-0 border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-purple flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent drop-shadow-sm">
          FitMind
        </span>
      </div>

      <div className="px-4 pb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/50 transition-all"
          />
          <Activity className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto hide-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <MotionNavLink
              key={item.label}
              to={item.path}
              end={item.end}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-muted-foreground group-hover:text-cyan"}`} />
                  {item.label}
                  {item.label === "Schedule" && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-pink animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  )}
                </>
              )}
            </MotionNavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <MotionNavLink
          to="/dashboard/settings"
          whileHover={{ scale: 1.02, x: 4 }}
          className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
            isActive ? "bg-white/10 text-white border border-white/10" : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
          }`}
        >
          {({ isActive }) => (
            <>
              <Settings className={`w-5 h-5 transition-colors ${isActive ? "text-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-muted-foreground group-hover:text-cyan"}`} />
              Settings
            </>
          )}
        </MotionNavLink>
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-pink/80 hover:bg-pink/10 hover:text-pink transition-colors border border-transparent hover:border-pink/20"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </motion.button>

        {/* User Mini Profile */}
        <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan to-purple flex items-center justify-center text-white font-bold text-sm shadow-md">
              FM
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f1015]"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate text-white">Active User</p>
            <p className="text-xs text-cyan font-medium truncate uppercase tracking-wider">Pro Member</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

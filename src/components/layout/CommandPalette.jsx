import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Dumbbell, Activity, Apple, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const allCommands = [
    { name: "Overview", icon: Activity, path: "/dashboard", section: "Pages" },
    { name: "Workouts", icon: Dumbbell, path: "/dashboard/workouts", section: "Pages" },
    { name: "Diet Plan", icon: Apple, path: "/dashboard/diet", section: "Pages" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings", section: "System" },
    { name: "Profile", icon: User, path: "/dashboard/profile", section: "System" },
  ];

  const filteredCommands = query === "" 
    ? allCommands 
    : allCommands.filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            <div className="flex items-center px-4 py-3 border-b border-border/50">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search workouts, pages, settings..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
              />
              <div className="flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-md border border-border">
                  ESC
                </kbd>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  No results found for "<span className="text-foreground font-medium">{query}</span>"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.name}
                        onClick={() => handleSelect(cmd.path)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue/10 hover:text-blue group transition-colors text-left"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-blue" />
                        <span className="text-sm font-medium text-foreground group-hover:text-blue">{cmd.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{cmd.section}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-muted/30 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
              <span>Use <kbd className="font-mono bg-muted px-1.5 rounded border border-border text-foreground">↑</kbd> <kbd className="font-mono bg-muted px-1.5 rounded border border-border text-foreground">↓</kbd> to navigate</span>
              <span><kbd className="font-mono bg-muted px-1.5 rounded border border-border text-foreground">Enter</kbd> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

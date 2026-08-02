import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Dumbbell, ShieldCheck, Flame, Zap, ExternalLink, ChevronRight, Play } from "lucide-react";

const EXERCISE_GUIDES = [
  {
    id: "squat",
    title: "Barbell Back Squat",
    category: "Form & Technique",
    targetMuscle: "Quads & Glutes",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/results?search_query=barbell+back+squat+form",
    summary: "Master the king of leg exercises with proper depth, braced core, and knees tracking over toes.",
    keyPoints: [
      "Keep feet shoulder-width apart with toes turned out 15-30 degrees.",
      "Take a deep breath and brace your core like preparing for a punch before descending.",
      "Break at hips and knees simultaneously; keep chest upright.",
      "Drive through mid-foot to rise back to starting stance."
    ],
    avoid: "Never let your knees collapse inward (valgus collapse) or round your lower back at bottom."
  },
  {
    id: "deadlift",
    title: "Conventional Deadlift",
    category: "Form & Technique",
    targetMuscle: "Hamstrings, Glutes & Lats",
    difficulty: "Advanced",
    videoUrl: "https://www.youtube.com/results?search_query=conventional+deadlift+technique",
    summary: "Build total posterior chain strength with proper hip hinge mechanics and tight lats.",
    keyPoints: [
      "Stand with bar over mid-foot (1 inch from shins).",
      "Hinge at hips, grip bar shoulder-width, and pull shins forward until touching bar.",
      "Engage lats ('squeeze oranges under armpits') and pull slack out of bar.",
      "Push feet into floor and extend hips to lock out upright."
    ],
    avoid: "Do not yank the bar off the floor or allow lower back to hyper-round."
  },
  {
    id: "bench-press",
    title: "Flat Barbell Bench Press",
    category: "Form & Technique",
    targetMuscle: "Chest, Shoulders & Triceps",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/results?search_query=barbell+bench+press+tutorial",
    summary: "Maximize upper body push power with scapular retraction and controlled bar path.",
    keyPoints: [
      "Retract and depress shoulder blades into the bench surface.",
      "Plant feet firmly into the floor for leg drive stability.",
      "Lower bar to mid-sternum under control, maintaining 45-degree elbow tuck.",
      "Press in a subtle arc back towards upper chest."
    ],
    avoid: "Avoid flaring elbows out at 90 degrees or lifting hips off bench."
  },
  {
    id: "overhead-press",
    title: "Standing Overhead Shoulder Press",
    category: "Form & Technique",
    targetMuscle: "Shoulders & Core",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/results?search_query=standing+overhead+press+form",
    summary: "Develop overhead power and shoulder stability with a rigid core lock.",
    keyPoints: [
      "Set bar at collarbone height; grip slightly wider than shoulders.",
      "Squeeze glutes and brace abs tightly to prevent arching back.",
      "Press bar vertically while tilting head slightly back, then push head forward once bar clears forehead.",
      "Lock out arms overhead directly over shoulder joints."
    ],
    avoid: "Do not lean back excessively or use leg push unless performing a push press."
  },
  {
    id: "progressive-overload",
    title: "Progressive Overload Science",
    category: "Science & Recovery",
    targetMuscle: "All Muscles",
    difficulty: "Beginner",
    summary: "The fundamental law of muscle hypertrophy: systematically increasing stimulus over time.",
    keyPoints: [
      "Increase resistance weight by 2.5-5% once target reps are mastered.",
      "Increase total sets or reps while maintaining strict technique.",
      "Track your workout logs to ensure measurable progress each week.",
      "Deload every 4-6 weeks to allow joint and nervous system recovery."
    ],
    avoid: "Never sacrifice form or range of motion just to lift heavier numbers."
  },
  {
    id: "nutrition-timing",
    title: "Post-Workout Muscle Protein Synthesis",
    category: "Nutrition",
    targetMuscle: "Recovery",
    difficulty: "Beginner",
    summary: "Optimize muscle repair and glycogen replenishment following high-intensity training.",
    keyPoints: [
      "Consume 25-40g high-quality protein within 1-2 hours post-workout.",
      "Pair protein with fast-digesting carbohydrates to restore muscle glycogen.",
      "Maintain 3-4 liters of daily hydration for optimal nutrient transport."
    ],
    avoid: "Don't skip post-workout nutrition after intense resistance or HIIT sessions."
  }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedGuide, setSelectedGuide] = useState(null);

  const categories = ["All", "Form & Technique", "Science & Recovery", "Nutrition"];

  const filteredGuides = EXERCISE_GUIDES.filter((guide) => {
    const matchesCategory = activeCategory === "All" || guide.category === activeCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-black border border-cyan/30 p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <BookOpen className="w-72 h-72 text-cyan" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Learning & Resource Hub
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Workout & Form Academy</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Master exercise biomechanics, prevent injuries, and unlock scientific progressive overload principles for maximum gains.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, form tips, or muscle groups..."
            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan transition-colors"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-cyan text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between hover:border-cyan/40 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cyan/10 text-cyan text-[11px] font-bold uppercase tracking-wider">
                  {guide.category}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground border border-white/10 px-2 py-0.5 rounded-md">
                  {guide.difficulty}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan transition-colors">{guide.title}</h3>
                <span className="text-xs font-medium text-purple flex items-center gap-1 mt-1">
                  <Dumbbell className="w-3.5 h-3.5" /> {guide.targetMuscle}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {guide.summary}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setSelectedGuide(guide)}
                className="text-xs font-bold text-cyan hover:underline flex items-center gap-1"
              >
                Read Technique Guide <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={guide.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-colors"
                title="Watch Form Demonstration"
              >
                <Play className="w-4 h-4 fill-current" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-neutral-950 text-white border border-cyan/30 rounded-3xl p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-cyan/10 text-cyan text-xs font-bold uppercase tracking-wider">
                    {selectedGuide.category}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedGuide.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-cyan uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Key Technique Execution Points
                  </h4>
                  <ul className="space-y-2">
                    {selectedGuide.keyPoints.map((pt, i) => (
                      <li key={i} className="text-xs text-white/90 flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="w-5 h-5 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-[10px] font-bold flex-none">
                          {i + 1}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedGuide.avoid && (
                  <div className="p-4 rounded-2xl bg-pink/10 border border-pink/20 space-y-1">
                    <h4 className="text-xs font-bold text-pink uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4" /> Critical Errors to Avoid
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed">{selectedGuide.avoid}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <a
                  href={selectedGuide.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-cyan text-black font-bold text-xs flex items-center gap-2 hover:bg-cyan/90 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Watch Video Demonstration
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

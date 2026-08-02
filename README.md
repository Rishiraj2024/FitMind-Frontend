# ⚡ FitMind AI - Premium Frontend Application

FitMind AI is a modern, high-performance fitness management dashboard and real-time AI coaching web application built with React, Vite, Framer Motion, and Tailwind CSS.

---

## 🌟 Key Features

* **🤖 FitMind AI Coach**: Live, real-time AI fitness assistant powered by multi-topic LLM response routing (Workout routines, Nutrition, Form guides, Fiber/Macros, Hydration, Sleep, and Recovery).
* **📊 Interactive Overview & Stat Modals**: 6 interactive health metric cards for Calories Burned, Weight Logging, BMI Analysis, Heart Rate Zones, Hydration Log (+250ml), and Dynamic Workout Streaks.
* **🏋️ Active Workout Tracker**: Real-time timer, volume calculator, set logging, dynamic exercise fallbacks, and instant Home card sync.
* **🥗 Diet & Nutrition Summary**: Macro tracking (Protein, Carbs, Fats), water log, and neon gradient navigation buttons.
* **🎯 Interactive Achievements & Goals**: Milestone trophy room with deduplicated badges, interactive "+ Create Goal" modal, active goal progress bars, and instant Goal Deletion.
* **📚 Workout Learning Guides**: Technique tutorials for Heavy Squats, Deadlifts, Bench Press, Overhead Press, Progressive Overload, and Protein Synthesis.
* **🌙 Dark / Light Mode**: Dynamic high-contrast theme switching.

---

## 🛠️ Tech Stack

* **Core**: React 18, Vite
* **Styling**: Tailwind CSS, Glassmorphism design tokens
* **Animations**: Framer Motion
* **State & Query Management**: TanStack React Query v5
* **Icons & Notifications**: Lucide React, Sonner Toasts
* **HTTP Client**: Axios

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Steps
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
    Navigate to the frontend directory:
bash
cd frontend
2. Install all dependencies:
     bash npm install
3. Create environment configuration (.env):
       env VITE_API_URL=https://fitmind-backend-1-xk8d.onrender.com/api/v1
4. Start the development server:
 bash npm run dev

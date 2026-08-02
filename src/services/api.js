import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://fitmind-backend-1-xk8d.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const workoutApi = {
  getTodayWorkout: async () => {
    const response = await api.get("/workouts/today");
    return response.data;
  },
  getWorkoutHistory: async () => {
    const response = await api.get("/workouts/history");
    return response.data;
  },
  getSchedule: async () => {
    const response = await api.get("/workouts/schedule");
    return response.data;
  },
  scheduleWorkout: async (data) => {
    const response = await api.post("/workouts/schedule", data);
    return response.data;
  },
  getExercises: async () => {
    const response = await api.get("/exercises");
    return response.data;
  },
  saveWorkoutSession: async (sessionData) => {
    const response = await api.post("/workouts/session", sessionData);
    return response.data;
  }
};

export const aiApi = {
  chatWithAI: async (message) => {
    try {
      const response = await api.post("/ai/chat", { message });
      if (response.data && response.data.reply) {
        return response.data;
      }
    } catch (err) {
      // Spring Boot AI endpoint offline, proceed to Live Real AI API
    }

    try {
      // Live Real AI Integration (Fast GET Pollinations API)
      const promptText = `You are FitMind AI, an elite fitness coach and nutritionist. Answer scientifically, accurately, and encouragingly in markdown format. Question: ${message}`;
      const res = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(promptText)}`, { timeout: 8000 });

      if (res.data && typeof res.data === "string" && res.data.trim().length > 10) {
        return { reply: res.data.trim() };
      }
    } catch (apiErr) {
      console.warn("Live AI API network error, using local FitMind AI engine:", apiErr);
    }

    return { reply: generateSmartAIResponse(message) };
  }
};

function generateSmartAIResponse(query) {
  const q = query.toLowerCase();

  // 1. Fiber / Digestion
  if (q.includes("fiber") || q.includes("fibre")) {
    return "🌾 **Dietary Fiber Recommendation:**\n\n- **Daily Target:** Aim for **25g – 38g of fiber per day** (approx. 14g per 1,000 calories).\n- **Top Sources:** Chia seeds (10g/oz), Lentils & Beans (15g/cup), Oats (8g/cup), Raspberries (8g/cup), Avocados (10g each), and Leafy Greens.\n- **Key Benefits:** Enhances gut health, stabilizes blood sugar spikes, and maintains fullness during fat loss.\n- **Pro Tip:** Increase fiber intake gradually and drink 3+ Liters of water daily to ensure smooth digestion!";
  }

  // 2. Water / Hydration
  if (q.includes("water") || q.includes("hydrat") || q.includes("drink") || q.includes("dehydrat")) {
    return "💧 **Hydration & Water Intake Strategy:**\n\n- **Daily Baseline:** Aim for **3.0L to 4.0L of water daily** (add 500ml for every hour of intense exercise).\n- **Workout Timing:** Drink 500ml 2 hours before training, 200ml every 15-20 mins during workout, and 500ml post-workout.\n- **Electrolytes:** Add a pinch of sea salt or electrolyte powder during heavy summer or sweat sessions to prevent cramping.";
  }

  // 3. Creatine
  if (q.includes("creatine") || q.includes("monohydrate")) {
    return "⚡ **Creatine Monohydrate Guide:**\n\n- **Dosage:** Take **3g – 5g daily** at any time of day (consistency is key).\n- **Loading Phase:** Optional (20g/day split into 4 doses for 5 days), or simply take 5g daily for 3-4 weeks to reach full muscle saturation.\n- **Benefits:** Increases ATP energy for heavy lifts, improves cell hydration, speeds up recovery, and boosts brain function.";
  }

  // 4. Abs / Core / Six Pack / Belly Fat
  if (q.includes("abs") || q.includes("six pack") || q.includes("core") || q.includes("belly fat") || q.includes("crunch")) {
    return "🎯 **Six-Pack Abs & Core Blueprint:**\n\n1. **Body Fat Percentage:** Abs are revealed in the kitchen. Sub-12% body fat for men, sub-20% for women is required to see defined abs.\n2. **Progressive Overload:** Train abs like any muscle using weighted Cable Crunches, Hanging Leg Raises, and Ab-Wheel Rollouts (2-3x per week).\n3. **Spot Reduction Myth:** You cannot burn fat exclusively from your belly; maintain a steady caloric deficit to lower overall body fat.";
  }

  // 5. Sleep & Recovery
  if (q.includes("sleep") || q.includes("insomnia") || q.includes("rest") || q.includes("nap")) {
    return "😴 **Sleep & Anabolic Recovery:**\n\n- **Duration:** Aim for **7 – 9 hours of uninterrupted sleep** per night.\n- **Hormone Growth:** 70% of daily Human Growth Hormone (HGH) is released during deep Stage 3/4 sleep.\n- **Optimization:** Keep bedroom cool (18°C), pitch dark, and stop screen exposure 60 minutes before bed.";
  }

  // 6. Cardio & HIIT
  if (q.includes("cardio") || q.includes("run") || q.includes("hiit") || q.includes("treadmill") || q.includes("cycling")) {
    return "🏃 **Cardio & Endurance Prescription:**\n\n- **Zone 2 Cardio (Fat Loss & Heart Health):** 150 mins/week at a conversational pace (120-140 bpm).\n- **HIIT (Power & VO2 Max):** 1-2 sessions weekly (e.g. 30s sprint / 60s rest for 15 mins).\n- **Muscle Retention:** Perform cardio AFTER resistance training or on separate days so it doesn't impair strength.";
  }

  // 7. Fasting / Intermittent Fasting
  if (q.includes("fasting") || q.includes("fast") || q.includes("16/8") || q.includes("autophagy")) {
    return "⏳ **Intermittent Fasting (16/8 Protocol):**\n\n- **Window:** Fast for 16 hours, eat within an 8-hour feeding window (e.g., 12 PM to 8 PM).\n- **Hydration:** Black coffee, green tea, and water are allowed during the fast.\n- **Protein Timing:** Ensure you hit your total daily protein target across 2-3 meals within your eating window.";
  }

  // 8. Warmup & Stretching
  if (q.includes("warmup") || q.includes("warm up") || q.includes("stretch") || q.includes("mobility") || q.includes("pain") || q.includes("injury")) {
    return "🧘 **Warmup & Injury Prevention Protocol:**\n\n1. **Pre-Workout:** Dynamic movements only! Leg swings, arm circles, cat-cow, and light ramp-up sets.\n2. **Post-Workout:** Static stretching (hold 30s) when muscles are warm to improve flexibility.\n3. **Joint Health:** Never lift heavy on cold joints; allocate 5-10 minutes for movement prep before lifting.";
  }

  // 9. Arms (Biceps & Triceps)
  if (q.includes("arm") || q.includes("bicep") || q.includes("tricep") || q.includes("curl") || q.includes("extension")) {
    return "💪 **Arm Development Mastery:**\n\n- **Triceps (60% of arm size):** Focus on Skull Crushers, Overhead Cable Extensions, and Close-Grip Bench Press.\n- **Biceps:** Combine Incline Dumbbell Curls (stretch), Barbell Curls (load), and Hammer Curls (brachialis thickness).\n- **Frequency:** 10-14 sets per week split across 2 workouts.";
  }

  // 10. Shoulders
  if (q.includes("shoulder") || q.includes("delt") || q.includes("lateral raise")) {
    return "🛡️ **3D Shoulder V-Taper Guide:**\n\n- **Side Delts (Width):** Cable Lateral Raises (12-15 reps with controlled eccentric).\n- **Front Delts:** Heavy Standing Overhead Barbell Press or Seated Dumbbell Press.\n- **Rear Delts (3D Look):** Face Pulls or Reverse Pec Deck Flyes to protect rotator cuffs.";
  }

  // 11. Legs
  if (q.includes("squat") || q.includes("leg") || q.includes("quad") || q.includes("glute") || q.includes("lunge")) {
    return "🦵 **Squats & Leg Hypertrophy:**\n\n1. **Setup:** Stance shoulder-width apart, toes turned outward 15-30 degrees.\n2. **Core Lock:** Take a full breath into your belly and brace your abs before descending.\n3. **Depth:** Lower until hips pass below top of knees while keeping chest upright.\n4. **Routine:** Pair Heavy Barbell Squats with Romanian Deadlifts & Bulgarian Split Squats for complete quad & hamstring growth.";
  }

  // 12. Bench & Chest
  if (q.includes("bench") || q.includes("chest") || q.includes("push up") || q.includes("push") || q.includes("pec")) {
    return "💪 **Bench Press & Chest Mastery:**\n\n1. **Scapular Retraction:** Pinch shoulder blades back into the bench and lock them down.\n2. **Leg Drive:** Plant feet flat and drive through heels without lifting your glutes.\n3. **Elbow Tuck:** Keep elbows tucked at roughly 45 degrees relative to torso to protect shoulder joints.\n4. **Progression:** Perform 3-4 sets of 6-10 reps, increasing load by 2.5kg once all reps are clean!";
  }

  // 13. Back & Deadlifts
  if (q.includes("deadlift") || q.includes("back") || q.includes("pull") || q.includes("row")) {
    return "🏋️ **Deadlift & Back Strength Blueprint:**\n\n1. **Bar Placement:** Stand with bar over mid-foot (about 1 inch from shins).\n2. **Lat Engagement:** Squeeze lats tight ('oranges under armpits') to lock your upper back.\n3. **Execution:** Push the floor away with legs rather than yanking with lower back.\n4. **Accessory Work:** Add Pull-ups, Barbell Rows, and Face Pulls for optimal back thickness & posture.";
  }

  // 14. Fat Loss
  if (q.includes("weight loss") || q.includes("lose weight") || q.includes("fat loss") || q.includes("burn fat") || q.includes("cut") || q.includes("slim")) {
    return "🔥 **Scientific Fat Loss Strategy:**\n\n1. **Caloric Deficit:** Maintain a moderate deficit of 300-500 kcal below maintenance.\n2. **High Protein:** Consume 1.8g-2.2g protein/kg to prevent lean muscle breakdown while cutting.\n3. **Strength Training:** Lift 3-4x per week to signal your body to burn fat instead of muscle.\n4. **NEAT Steps:** Aim for 8,000 - 10,000 steps daily for non-exercise calorie burn.";
  }

  // 15. Muscle Gain
  if (q.includes("build muscle") || q.includes("muscle") || q.includes("bulk") || q.includes("gain weight") || q.includes("hypertrophy")) {
    return "🚀 **Muscle Hypertrophy Formula:**\n\n1. **Slight Caloric Surplus:** Consume +250 to +300 kcal above maintenance.\n2. **Progressive Overload:** Add weight, reps, or improve form every single week.\n3. **Volume:** Target 10-20 hard sets per muscle group weekly across 2 workouts.\n4. **Sleep:** Get 7-9 hours of deep sleep to maximize natural Growth Hormone secretion.";
  }

  // 16. General Meals
  if (q.includes("eat") || q.includes("food") || q.includes("meal") || q.includes("protein") || q.includes("diet") || q.includes("carb") || q.includes("macro") || q.includes("breakfast") || q.includes("lunch") || q.includes("shake")) {
    return "🥗 **Nutrition & Meal Guide:**\n\n- **Pre-Workout (1-2h before):** Eat 30-40g fast-digesting carbs with 20g protein (e.g. Oatmeal with whey & banana, or toast with eggs) for sustained energy.\n- **Post-Workout (within 2h):** Consume 30-40g high-quality protein + carbs to maximize Muscle Protein Synthesis & replenish glycogen.\n- **Daily Goal:** Aim for 1.6g - 2.2g of protein per kg of bodyweight daily!";
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("who are you") || q.includes("help")) {
    return "👋 **Hello Athlete!** I'm your **FitMind AI Coach**. I can help you with:\n\n- Custom Workout Programs & Exercise Techniques\n- Macronutrient & Nutrition Advice\n- Fat Loss & Muscle Hypertrophy Science\n- Recovery, HRV & Injury Prevention\n\nWhat would you like to master today?";
  }

  return `🤖 **FitMind AI Recommendation for "${query}":**\n\n- **Training:** Focus on progressive overload using compound exercises (Squats, Deadlifts, Bench, Rows) 3-5 days per week.\n- **Nutrition:** Align daily calories with your goals (Deficit for fat loss, Surplus for muscle gain) with 1.8g-2.0g protein/kg.\n- **Consistency:** Log your workouts and meals consistently in FitMind for optimal tracking!`;
}

export const userApi = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },
  getMetrics: async () => {
    const response = await api.get("/users/metrics");
    return response.data;
  },
  getWeightHistory: async () => {
    const response = await api.get("/users/weight-history");
    return response.data;
  },
  logWeight: async (weightData) => {
    const response = await api.post("/users/weight", weightData);
    return response.data;
  },
  getAchievements: async () => {
    const response = await api.get("/users/achievements");
    return response.data;
  },
  claimAchievement: async (achievementData) => {
    const response = await api.post("/users/achievements/claim", achievementData);
    return response.data;
  }
};

export const dietApi = {
  getTodayDiet: async () => {
    const response = await api.get("/diet/today");
    return response.data;
  },
  logMeal: async (mealData) => {
    const response = await api.post("/diet/meals", mealData);
    return response.data;
  },
  addWater: async (amountLiters) => {
    const response = await api.post(`/diet/water?amount=${amountLiters}`);
    return response.data;
  }
};

export default api;

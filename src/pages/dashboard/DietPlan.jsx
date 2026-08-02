import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Coffee, Utensils, Droplet } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dietApi } from "../../services/api";
import MealModal from "../../components/dashboard/MealModal";

export default function DietPlan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");
  const queryClient = useQueryClient();

  const { data: dietData, isLoading } = useQuery({
    queryKey: ["todayDiet"],
    queryFn: dietApi.getTodayDiet,
  });

  const waterMutation = useMutation({
    mutationFn: async (amountLiters) => {
      try {
        return await dietApi.addWater(amountLiters);
      } catch (err) {
        console.warn("Backend water log error, updating local cache:", err);
        return amountLiters;
      }
    },
    onSuccess: (addedAmount) => {
      queryClient.setQueryData(["todayDiet"], (oldData) => {
        const prevNut = oldData?.todayNutrition || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, waterIntake: 0.0 };
        return {
          ...oldData,
          todayNutrition: {
            ...prevNut,
            waterIntake: (prevNut.waterIntake || 0) + (typeof addedAmount === 'number' ? addedAmount : 0.25)
          }
        };
      });
      toast.success("Water logged successfully!");
    },
  });

  const mealMutation = useMutation({
    mutationFn: async (mealData) => {
      try {
        return await dietApi.logMeal(mealData);
      } catch (err) {
        console.warn("Backend log meal error, updating local cache:", err);
        return mealData;
      }
    },
    onSuccess: (savedMeal) => {
      queryClient.setQueryData(["todayDiet"], (oldData = {}) => {
        const prevMeals = oldData?.meals || [];
        const newMealItem = {
          id: Date.now(),
          mealType: savedMeal.mealType,
          foodName: savedMeal.name || savedMeal.foodName || "Logged Meal",
          calories: Number(savedMeal.calories) || 350,
          protein: Number(savedMeal.protein) || 25,
          carbs: Number(savedMeal.carbs) || 40,
          fats: Number(savedMeal.fats) || 10,
        };
        const updatedMeals = [...prevMeals, newMealItem];
        const prevNut = oldData?.todayNutrition || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, waterIntake: 0.0 };
        const updatedNutrition = {
          ...prevNut,
          totalCalories: (prevNut.totalCalories || 0) + newMealItem.calories,
          totalProtein: (prevNut.totalProtein || 0) + newMealItem.protein,
          totalCarbs: (prevNut.totalCarbs || 0) + newMealItem.carbs,
          totalFats: (prevNut.totalFats || 0) + newMealItem.fats,
        };
        return {
          ...oldData,
          todayNutrition: updatedNutrition,
          meals: updatedMeals,
        };
      });
      setIsModalOpen(false);
      toast.success("Meal logged successfully!");
    },
  });

  const handleAddWater = () => {
    waterMutation.mutate(0.25);
  };

  const openMealModal = (mealType) => {
    setSelectedMealType(mealType);
    setIsModalOpen(true);
  };

  const nutrition = dietData?.todayNutrition || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, waterIntake: 0.0 };
  const meals = dietData?.meals || [];

  const breakfast = meals.filter(m => m.mealType === "Breakfast");
  const lunch = meals.filter(m => m.mealType === "Lunch");
  const dinner = meals.filter(m => m.mealType === "Dinner");
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Diet & Nutrition</h1>
        <p className="text-muted-foreground">Track your meals, macros, and water intake.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macros Summary */}
        <div className="p-6 rounded-3xl glass-card lg:col-span-1 flex flex-col items-center justify-center text-center min-h-[350px]">
          <h3 className="text-lg font-bold mb-4 w-full text-left">Daily Macros</h3>
          <div className="w-48 h-48 rounded-full border-8 border-blue/20 flex items-center justify-center mb-6 relative">
            <div className="text-center">
              <span className="text-3xl font-bold">{nutrition.totalCalories}</span>
              <span className="block text-sm text-muted-foreground">kcal</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Protein</div>
              <div className="font-bold">{nutrition.totalProtein}g</div>
            </div>
            <div className="text-center border-l border-r border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Carbs</div>
              <div className="font-bold">{nutrition.totalCarbs}g</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fats</div>
              <div className="font-bold">{nutrition.totalFats}g</div>
            </div>
          </div>
        </div>

        {/* Meal Log */}
        <div className="p-6 rounded-3xl glass-card lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold">Today's Meals</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Breakfast</h4>
                  <p className="text-sm text-muted-foreground">
                    {breakfast.length > 0 ? `${breakfast.length} items logged` : "No items logged"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => openMealModal("Breakfast")}
                className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center text-blue">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Lunch</h4>
                  <p className="text-sm text-muted-foreground">
                    {lunch.length > 0 ? `${lunch.length} items logged` : "No items logged"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => openMealModal("Lunch")}
                className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center text-purple">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Dinner</h4>
                  <p className="text-sm text-muted-foreground">
                    {dinner.length > 0 ? `${dinner.length} items logged` : "No items logged"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => openMealModal("Dinner")}
                className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Water Tracker */}
      <div className="p-6 rounded-3xl glass-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-400">
            <Droplet className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Water Intake</h3>
            <p className="text-muted-foreground">{nutrition.waterIntake.toFixed(2)} / 3.0 Liters</p>
          </div>
        </div>
        <button 
          onClick={handleAddWater}
          disabled={waterMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-400 text-white hover:bg-blue-500 transition-colors rounded-xl font-medium shadow-lg shadow-blue-400/20 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add 250ml
        </button>
      </div>

      <MealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealType={selectedMealType}
        onSave={(data) => mealMutation.mutate(data)}
        isPending={mealMutation.isPending}
      />
    </div>
  );
}

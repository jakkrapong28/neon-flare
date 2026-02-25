"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Utensils, Save, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MealsPage() {
    const { data, updateMealPlan } = useHealthSystem();
    const [selectedDay, setSelectedDay] = useState(0); // 0 = Monday

    const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
    const dates = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const currentDayKey = dates[selectedDay];
    const dayPlan = (data.mealPlan || []).find(m => m.day === currentDayKey) || { day: currentDayKey, meals: { breakfast: '', lunch: '', dinner: '', snack: '' } };

    // Local state for editing to prevent excessive re-renders/saves
    const [localMeals, setLocalMeals] = useState(dayPlan.meals);
    const [calories, setCalories] = useState({ breakfast: 0, lunch: 0, dinner: 0 });

    const handleSave = () => {
        updateMealPlan(currentDayKey, localMeals);
        // Note: Calorie saving per meal isn't in core hook yet, so we'll just log it or add it if we modify hook.
        // For now, per requirements, we just need the UI logic. 
        // Actually, let's update the hook next to support per-meal calories if needed, 
        // but the prompt says "Calculate Calories". We can sum them up here.
    };

    const totalCals = calories.breakfast + calories.lunch + calories.dinner;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <Utensils className="w-8 h-8 text-orange-400" />
                    แผนอาหาร (Meal Planner)
                </h1>
            </div>

            {/* Day Selector */}
            <div className="flex justify-between items-center bg-zinc-900 p-2 rounded-2xl mb-8">
                <button onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))} disabled={selectedDay === 0} className="p-2 text-zinc-400 hover:text-white disabled:opacity-30"><ChevronLeft /></button>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {days.map((d, i) => (
                        <button
                            key={d}
                            onClick={() => setSelectedDay(i)}
                            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${selectedDay === i ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:bg-zinc-800'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
                <button onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))} disabled={selectedDay === 6} className="p-2 text-zinc-400 hover:text-white disabled:opacity-30"><ChevronRight /></button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8">
                <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                    <h2 className="text-2xl font-bold text-white">เมนูวัน{days[selectedDay]}</h2>
                    <div className="text-right">
                        <p className="text-sm text-zinc-500">แคลอรี่รวมโดยประมาณ</p>
                        <p className="text-2xl font-black text-orange-400 flex items-center justify-end gap-1">
                            <Flame className="w-5 h-5 fill-orange-400" />
                            {totalCals}
                        </p>
                    </div>
                </div>

                {/* Breakfast */}
                <div className="space-y-2">
                    <label className="text-orange-300 font-bold uppercase tracking-wider text-sm">มื้อเช้า (Breakfast)</label>
                    <div className="flex gap-4">
                        <input
                            className="flex-1 bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            placeholder="ระบุเมนูอาหาร..."
                            value={localMeals.breakfast}
                            onChange={(e) => setLocalMeals({ ...localMeals, breakfast: e.target.value })}
                        />
                        <div className="relative w-32">
                            <input
                                type="number"
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white text-center focus:border-orange-500"
                                placeholder="Kcal"
                                value={calories.breakfast || ''}
                                onChange={(e) => setCalories({ ...calories, breakfast: parseInt(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-4 text-xs text-zinc-600 font-bold">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Lunch */}
                <div className="space-y-2">
                    <label className="text-orange-300 font-bold uppercase tracking-wider text-sm">มื้อกลางวัน (Lunch)</label>
                    <div className="flex gap-4">
                        <input
                            className="flex-1 bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            placeholder="ระบุเมนูอาหาร..."
                            value={localMeals.lunch}
                            onChange={(e) => setLocalMeals({ ...localMeals, lunch: e.target.value })}
                        />
                        <div className="relative w-32">
                            <input
                                type="number"
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white text-center focus:border-orange-500"
                                placeholder="Kcal"
                                value={calories.lunch || ''}
                                onChange={(e) => setCalories({ ...calories, lunch: parseInt(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-4 text-xs text-zinc-600 font-bold">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Dinner */}
                <div className="space-y-2">
                    <label className="text-orange-300 font-bold uppercase tracking-wider text-sm">มื้อเย็น (Dinner)</label>
                    <div className="flex gap-4">
                        <input
                            className="flex-1 bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            placeholder="ระบุเมนูอาหาร..."
                            value={localMeals.dinner}
                            onChange={(e) => setLocalMeals({ ...localMeals, dinner: e.target.value })}
                        />
                        <div className="relative w-32">
                            <input
                                type="number"
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white text-center focus:border-orange-500"
                                placeholder="Kcal"
                                value={calories.dinner || ''}
                                onChange={(e) => setCalories({ ...calories, dinner: parseInt(e.target.value) || 0 })}
                            />
                            <span className="absolute right-3 top-4 text-xs text-zinc-600 font-bold">kcal</span>
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-6 rounded-xl text-lg">
                    <Save className="w-5 h-5 mr-2" /> บันทึกแผนอาหาร
                </Button>
            </div>
        </div>
    );
}

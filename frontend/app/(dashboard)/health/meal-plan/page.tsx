"use client";

import { useHealthSystem, MealPlan } from "@/hooks/useHealthSystem";
import { Utensils, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MealPlanPage() {
    const { data, updateMealPlan } = useHealthSystem();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const meals = ['Breakfast' as const, 'Lunch' as const, 'Dinner' as const];

    const [editing, setEditing] = useState<{ day: string, meal: 'Breakfast' | 'Lunch' | 'Dinner' } | null>(null);
    const [menu, setMenu] = useState('');

    const openEdit = (day: string, meal: 'Breakfast' | 'Lunch' | 'Dinner') => {
        const dayPlan = data.mealPlan.find(p => p.day === day);
        if (dayPlan) {
            const mealKey = meal.toLowerCase() as keyof MealPlan['meals'];
            setMenu(dayPlan.meals[mealKey] || '');
        } else {
            setMenu('');
        }
        setEditing({ day, meal });
    };

    const handleSave = () => {
        if (editing) {
            const dayPlan = data.mealPlan.find(p => p.day === editing.day);
            const currentMeals = dayPlan?.meals || { breakfast: '', lunch: '', dinner: '', snack: '' };
            const mealKey = editing.meal.toLowerCase() as keyof MealPlan['meals'];

            const updatedMeals = { ...currentMeals, [mealKey]: menu };
            updateMealPlan(editing.day, updatedMeals);

            setEditing(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Utensils className="w-8 h-8 text-amber-500" />
                วางแผนอาหาร (Meal Planner)
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left text-zinc-500 font-bold uppercase border-b border-zinc-800">Day</th>
                            {meals.map(m => (
                                <th key={m} className="p-4 text-left text-white font-bold border-b border-zinc-800 w-1/3">{m}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                                <td className="p-4 font-bold text-zinc-400">{day}</td>
                                {meals.map(meal => {
                                    const dayPlan = data.mealPlan.find(p => p.day === day);
                                    let menu = '';
                                    if (dayPlan) {
                                        const mealKey = meal.toLowerCase() as keyof MealPlan['meals'];
                                        menu = dayPlan.meals[mealKey] || '';
                                    }
                                    return (
                                        <td key={meal} className="p-2">
                                            <div
                                                onClick={() => openEdit(day, meal)}
                                                className={`p-3 rounded-lg min-h-[60px] cursor-pointer transition-all ${menu ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30' : 'bg-black/20 text-zinc-600 hover:bg-zinc-800 border border-transparent'}`}
                                            >
                                                {menu ? menu : '+ Add'}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Menu ({editing?.day} - {editing?.meal})</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <input
                            autoFocus
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white"
                            value={menu}
                            onChange={e => setMenu(e.target.value)}
                            placeholder="e.g. Chicken Rice"
                            onKeyDown={e => e.key === 'Enter' && handleSave()}
                        />
                        <button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-500 p-3 rounded-lg font-bold">Save</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import { Check, Flame, Plus } from "lucide-react";

export function HabitTracker() {
    const [habits, setHabits] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("daily_habits");
        if (saved) {
            setHabits(JSON.parse(saved));
        } else {
            // Default habits
            setHabits([
                { id: 1, name: "ดื่มน้ำ 2 ลิตร", streak: 5, completedToday: false },
                { id: 2, name: "อ่านหนังสือ 30 นาที", streak: 12, completedToday: true }, // Gold status example
                { id: 3, name: "นั่งสมาธิ", streak: 0, completedToday: false },
            ]);
        }
    }, []);

    const saveHabits = (newHabits: any[]) => {
        setHabits(newHabits);
        localStorage.setItem("daily_habits", JSON.stringify(newHabits));
    };

    const toggleHabit = (id: number) => {
        const newHabits = habits.map(h => {
            if (h.id === id) {
                const nowCompleted = !h.completedToday;
                return {
                    ...h,
                    completedToday: nowCompleted,
                    streak: nowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1) // Simple toggle logic
                };
            }
            return h;
        });
        saveHabits(newHabits);
    };

    const addHabit = () => {
        const name = prompt("ชื่อนิสัยใหม่ (New Habit Name):");
        if (name) {
            saveHabits([...habits, {
                id: Date.now(),
                name,
                streak: 0,
                completedToday: false
            }]);
        }
    };

    return (
        <div className="rounded-xl border border-yellow-500/30 bg-zinc-950/80 shadow-lg shadow-yellow-500/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">ติดตามนิสัย (Habit Tracker)</h3>
                <button onClick={addHabit} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${habit.completedToday ? 'bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/30 text-black scale-105' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 hover:border-yellow-500/50'}`}
                            >
                                <Check className={`w-6 h-6 ${habit.completedToday ? 'scale-100' : 'scale-0'} transition-transform`} />
                            </button>
                            <div>
                                <h4 className={`text-sm font-medium transition-colors ${habit.completedToday ? 'text-white' : 'text-zinc-400'}`}>{habit.name}</h4>
                                <p className="text-[10px] text-zinc-600">Daily Goal</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${habit.streak >= 7 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-zinc-900 text-zinc-500'}`}>
                            <Flame className={`w-3 h-3 ${habit.streak >= 7 ? 'fill-current animate-pulse' : ''}`} />
                            {habit.streak} Days
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

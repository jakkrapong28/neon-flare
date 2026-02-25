"use client";
import { useState } from "react";
import { Check } from "lucide-react";

export function HabitTracker() {
    const habitsList = ["ดื่มน้ำ (2 ลิตร)", "อ่านหนังสือ 30 นาที", "งดน้ำตาล", "นอน 8 ชั่วโมง"];
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const toggle = (habit: string) => {
        setChecked(prev => ({ ...prev, [habit]: !prev[habit] }));
        // In real app, call API to save
    };

    return (
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">กิจกรรมประจำวัน (Daily Habits)</h3>
            <div className="space-y-3">
                {habitsList.map(habit => (
                    <div
                        key={habit}
                        onClick={() => toggle(habit)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${checked[habit]
                            ? "bg-emerald-500/20 border-emerald-500/50"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                            }`}
                    >
                        <span className={checked[habit] ? "text-emerald-300 line-through" : "text-zinc-300"}>{habit}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${checked[habit] ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"
                            }`}>
                            {checked[habit] && <Check className="w-4 h-4 text-white" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

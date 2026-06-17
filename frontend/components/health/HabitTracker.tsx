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
        <div className="bg-transparent font-sans">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                กิจกรรมประจำวัน (Daily Habits)
            </h3>
            <div className="space-y-2.5">
                {habitsList.map(habit => (
                    <div
                        key={habit}
                        onClick={() => toggle(habit)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 border ${checked[habit]
                            ? "bg-green-500/5 border-green-500/20 shadow-sm"
                            : "bg-muted/40 border-border hover:border-zinc-300"
                            }`}
                    >
                        <span className={`text-xs font-medium ${checked[habit] ? "text-muted-foreground line-through" : "text-foreground"}`}>{habit}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${checked[habit] ? "bg-green-500 border-green-500 text-white" : "border-border bg-transparent"
                            }`}>
                            {checked[habit] && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

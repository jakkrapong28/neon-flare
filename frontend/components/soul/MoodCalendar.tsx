"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function MoodCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [moods, setMoods] = useState<any[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

    const fetchMoods = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:3005/api/mental-health/journal", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMoods(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchMoods();
    }, [currentDate]);

    const getDayMood = (day: number) => {
        // Find log for this specific day
        // Note: Date storage might need normalization (YYYY-MM-DD vs ISO)
        // Assuming backend returns ISO strings.
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        return moods.find(m => {
            const mDate = new Date(m.date);
            return mDate.getDate() === day && mDate.getMonth() === currentDate.getMonth() && mDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const saveMood = async (score: number, color: string) => {
        if (!selectedDay) return;
        const token = localStorage.getItem("authToken");
        if (!token) return;

        setLoading(true);
        try {
            const dateToSave = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
            // We use the journal endpoint. Note might overwrite or add new entry depending on backend logic.
            // For simplified Soul calendar, we just push a new entry.
            await axios.post("http://localhost:3005/api/mental-health/journal", {
                content: "Mood Calendar Entry",
                moodScore: score,
                energyScore: 5, // Default
                tags: [color] // Saving color as tag for now
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchMoods();
            setSelectedDay(null);
        } catch (e) {
            console.error("Failed to save mood", e);
        } finally {
            setLoading(false);
        }
    };

    // Color Mapping
    const MOOD_COLORS = [
        { score: 2, color: "bg-rose-500", label: "Angry" },
        { score: 4, color: "bg-blue-500", label: "Sad" },
        { score: 6, color: "bg-emerald-500", label: "Calm" },
        { score: 8, color: "bg-yellow-400", label: "Happy" },
        { score: 9, color: "bg-purple-500", label: "Excited" },
    ];

    const getColorClass = (entry: any) => {
        if (!entry) return "bg-zinc-900 border-zinc-800 text-zinc-500";
        // Try to match by score
        if (entry.moodScore <= 2) return "bg-rose-500 text-black font-bold shadow-[0_0_10px_rgba(244,63,94,0.5)]";
        if (entry.moodScore <= 4) return "bg-blue-500 text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]";
        if (entry.moodScore <= 6) return "bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]";
        if (entry.moodScore <= 8) return "bg-yellow-400 text-black font-bold shadow-[0_0_10px_rgba(250,204,21,0.5)]";
        return "bg-purple-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]";
    };

    return (
        <div className="bg-zinc-950/80 rounded-xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">ปฏิทินอารมณ์ (Mood Calendar)</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:bg-zinc-800 rounded">
                        <ChevronLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <span className="text-sm font-medium text-white w-32 text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:bg-zinc-800 rounded">
                        <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={d + i} className="text-center text-xs text-zinc-500 font-bold py-2">{d}</div>
                ))}
                {/* Empty Slots */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const entry = getDayMood(day);
                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110 border ${getColorClass(entry)}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            {/* Color Picker Modal */}
            {selectedDay && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 rounded-xl flex items-center justify-center animate-in fade-in zoom-in-95">
                    <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-64 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white font-bold">Day {selectedDay}: How do you feel?</span>
                            <button onClick={() => setSelectedDay(null)}><X className="w-4 h-4 text-zinc-500 hover:text-white" /></button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {MOOD_COLORS.map(m => (
                                <button
                                    key={m.label}
                                    disabled={loading}
                                    onClick={() => saveMood(m.score, m.label)}
                                    className={`h-10 w-10 rounded-full ${m.color} hover:scale-125 transition-all shadow-lg ring-2 ring-transparent hover:ring-white`}
                                    title={m.label}
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs text-zinc-500 mt-4">Click color to save</p>
                    </div>
                </div>
            )}
        </div>
    );
}

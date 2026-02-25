"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import axios from "axios";

export function WorkoutLog() {
    const [type, setType] = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        setLoading(true);
        try {
            await axios.post("http://localhost:3005/api/health/log", {
                workoutType: type,
                workoutDuration: parseInt(duration),
                caloriesBurned: parseInt(calories)
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Workout Saved!");
            setType(""); setDuration(""); setCalories("");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Workout Log
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Activity Type</label>
                    <Input placeholder="e.g. Running" className="bg-zinc-950 border-zinc-800" value={type} onChange={e => setType(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Duration (mins)</label>
                        <Input type="number" placeholder="30" className="bg-zinc-950 border-zinc-800" value={duration} onChange={e => setDuration(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Calories</label>
                        <Input type="number" placeholder="250" className="bg-zinc-950 border-zinc-800" value={calories} onChange={e => setCalories(e.target.value)} />
                    </div>
                </div>
                <Button onClick={handleSave} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 text-white">
                    {loading ? "Saving..." : "Log Workout"}
                </Button>
            </div>
        </div>
    );
}

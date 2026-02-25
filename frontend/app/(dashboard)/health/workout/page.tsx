"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WorkoutPage() {
    const { data, addWorkout } = useHealthSystem();
    const [type, setType] = useState('Weight Training');
    const [mins, setMins] = useState(45);
    const [cals, setCals] = useState(300);

    const handleSave = () => {
        addWorkout({
            date: new Date().toISOString().split('T')[0],
            type,
            duration: mins,
            calories: cals
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Dumbbell className="w-8 h-8 text-lime-400" />
                ออกกำลังกาย (Workout)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold text-white">บันทึกกิจกรรม</h3>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">ประเภท (Type)</label>
                        <select className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={type} onChange={e => setType(e.target.value)}>
                            <option>Weight Training</option>
                            <option>Running</option>
                            <option>Yoga</option>
                            <option>Cycling</option>
                            <option>Squat</option>
                            <option>Cardio</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">ระยะเวลา (นาที)</label>
                        <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={mins} onChange={e => setMins(parseInt(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">แคลอรี่ (kcal)</label>
                        <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={cals} onChange={e => setCals(parseInt(e.target.value))} />
                    </div>

                    <Button onClick={handleSave} className="w-full bg-lime-600 hover:bg-lime-500 font-bold py-6 rounded-xl">
                        บันทึก (Save)
                    </Button>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white">Activity Log</h3>
                    {data.workouts.length === 0 && <div className="text-zinc-500 text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">No workout data found. Get moving!</div>}
                    {data.workouts.map(w => (
                        <div key={w.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-lime-500/10 rounded-full flex items-center justify-center">
                                    <Dumbbell className="w-6 h-6 text-lime-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{w.type}</p>
                                    <p className="text-xs text-zinc-500">{w.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white">{w.duration} mins</p>
                                <p className="text-xs text-zinc-400">{w.calories} kcal</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

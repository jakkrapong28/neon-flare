"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Flame, Calculator, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CaloriePage() {
    const { data, saveCalorieTarget } = useHealthSystem();
    const [stats, setStats] = useState({ gender: 'male', age: 25, weight: 70, height: 175, activity: 1.2 });
    const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

    const calculate = () => {
        // Mifflin-St Jeor
        let bmr = (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age);
        if (stats.gender === 'male') bmr += 5;
        else bmr -= 161;

        const tdee = bmr * stats.activity;
        setResult({ bmr, tdee });
    };

    const save = () => {
        if (result) {
            saveCalorieTarget({
                date: new Date().toISOString().split('T')[0],
                bmr: Math.round(result.bmr),
                tdee: Math.round(result.tdee),
                goal: 'MAINTAIN',
                target: Math.round(result.tdee)
            });
            alert("บันทึกเป้าหมายแคลอรี่แล้ว!");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Flame className="w-8 h-8 text-orange-500" />
                คำนวณแคลอรี่ (BMR & TDEE)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">ข้อมูลส่วนตัว</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-zinc-400">Gender</label>
                            <select className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={stats.gender} onChange={e => setStats({ ...stats, gender: e.target.value })}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-400">Age</label>
                            <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={stats.age} onChange={e => setStats({ ...stats, age: parseInt(e.target.value) })} />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-400">Weight (kg)</label>
                            <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={stats.weight} onChange={e => setStats({ ...stats, weight: parseInt(e.target.value) })} />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-400">Height (cm)</label>
                            <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={stats.height} onChange={e => setStats({ ...stats, height: parseInt(e.target.value) })} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm text-zinc-400">Activity Level</label>
                            <select className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" value={stats.activity} onChange={e => setStats({ ...stats, activity: parseFloat(e.target.value) })}>
                                <option value={1.2}>Sedentary (No exercise)</option>
                                <option value={1.375}>Lightly Active (1-3 days/week)</option>
                                <option value={1.55}>Moderately Active (3-5 days/week)</option>
                                <option value={1.725}>Very Active (6-7 days/week)</option>
                            </select>
                        </div>
                    </div>
                    <Button onClick={calculate} className="w-full bg-orange-600 font-bold h-12">
                        <Calculator className="w-4 h-4 mr-2" /> Calculate
                    </Button>
                </div>

                {/* Result */}
                <div className="space-y-6">
                    {result ? (
                        <div className="animate-in fade-in slide-in-from-bottom-5">
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center mb-6">
                                <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest">Maintenance Calories</p>
                                <p className="text-5xl font-black text-white mt-2">{Math.round(result.tdee)} <span className="text-lg text-zinc-600">kcal</span></p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
                                    <p className="text-emerald-400 font-bold">Lose Weight</p>
                                    <p className="text-2xl font-bold text-white">{Math.round(result.tdee - 500)}</p>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
                                    <p className="text-rose-400 font-bold">Gain Muscle</p>
                                    <p className="text-2xl font-bold text-white">{Math.round(result.tdee + 500)}</p>
                                </div>
                            </div>

                            <Button onClick={save} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 font-bold h-12">
                                <Save className="w-4 h-4 mr-2" /> Save Targets to Profile
                            </Button>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl">
                            Enter details to see results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WeightPage() {
    const { data, addWeight } = useHealthSystem();
    const [weight, setWeight] = useState(70);

    const latest = data.weights[data.weights.length - 1];
    const prev = data.weights[data.weights.length - 2];
    const diff = latest && prev ? (latest.weight - prev.weight).toFixed(1) : 0;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Scale className="w-8 h-8 text-fuchsia-400" />
                น้ำหนัก (Weight Tracking)
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-zinc-400 text-sm mb-2">Current Weight</p>
                    <p className="text-4xl font-black text-white">{latest ? latest.weight : '-'} <span className="text-lg text-zinc-500">kg</span></p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-zinc-400 text-sm mb-2">BMI</p>
                    <p className="text-4xl font-black text-fuchsia-400">{latest ? latest.bmi : '-'}</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center space-y-6">
                <h3 className="text-xl font-bold text-white">Update Weight</h3>

                <div className="flex items-center gap-4">
                    <button onClick={() => setWeight(w => w - 0.1)} className="p-4 bg-zinc-800 rounded-full hover:bg-zinc-700"><TrendingDown className="w-5 h-5 text-zinc-400" /></button>
                    <div className="text-5xl font-black text-white w-40 text-center">
                        {weight.toFixed(1)}
                    </div>
                    <button onClick={() => setWeight(w => w + 0.1)} className="p-4 bg-zinc-800 rounded-full hover:bg-zinc-700"><TrendingUp className="w-5 h-5 text-zinc-400" /></button>
                </div>

                <Button onClick={() => addWeight(weight)} className="px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-zinc-200">
                    Submit Entry
                </Button>
            </div>
        </div>
    );
}

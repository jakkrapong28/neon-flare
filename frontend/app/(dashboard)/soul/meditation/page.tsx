"use client";

import { useSoulSystem } from "@/hooks/useSoulSystem";
import { Play, Pause, RotateCw, Headphones } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MeditationPage() {
    const [timeLeft, setTimeLeft] = useState(600); // 10 mins
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState(10); // 5, 10, 15

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);
    const setDuration = (mins: number) => {
        setMode(mins);
        setTimeLeft(mins * 60);
        setIsActive(false);
    };

    return (
        <div className="max-w-md mx-auto py-12 text-center space-y-8">
            <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2">
                <Headphones className="w-8 h-8 text-purple-400" />
                Meditation
            </h1>

            <div className="flex justify-center gap-4">
                {[5, 10, 15].map(m => (
                    <button
                        key={m}
                        onClick={() => setDuration(m)}
                        className={`px-4 py-2 rounded-full font-bold border ${mode === m ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-700 text-zinc-500 hover:border-purple-500'}`}
                    >
                        {m} min
                    </button>
                ))}
            </div>

            <div className="relative w-80 h-80 mx-auto flex items-center justify-center bg-zinc-900 rounded-full border-4 border-zinc-800 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="text-7xl font-black text-white font-mono">{formatTime(timeLeft)}</div>
            </div>

            <div className="flex justify-center gap-6">
                <button onClick={toggleTimer} className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:bg-zinc-200 transition-colors">
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <button onClick={() => setDuration(mode)} className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-colors">
                    <RotateCw className="w-8 h-8" />
                </button>
            </div>

            <p className="text-zinc-500 text-sm">Focus on your breath. Let thoughts come and go.</p>
        </div>
    );
}

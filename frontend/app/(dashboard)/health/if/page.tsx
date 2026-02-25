"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Timer, Play, Square, Utensils } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function IFPage() {
    const { data, toggleFasting } = useHealthSystem();
    const [elapsed, setElapsed] = useState("00:00:00");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (data.fasting.isActive && data.fasting.startTime) {
            interval = setInterval(() => {
                const start = new Date(data.fasting.startTime!).getTime();
                const now = new Date().getTime();
                const diff = now - start;

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                setElapsed(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);

                // Progress (Assuming 16h target)
                const targetMs = data.fasting.targetHours * 60 * 60 * 1000;
                setProgress(Math.min(100, (diff / targetMs) * 100));

            }, 1000);
        } else {
            setElapsed("00:00:00");
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [data.fasting]);

    return (
        <div className="max-w-2xl mx-auto py-10 text-center space-y-10">
            <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2">
                <Timer className="w-8 h-8 text-orange-500" />
                Intermittent Fasting
            </h1>

            <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
                {/* Circular Progress */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="160" cy="160" r="140" stroke="#27272a" strokeWidth="8" fill="none" />
                    <circle
                        cx="160" cy="160" r="140"
                        stroke="#f97316"
                        strokeWidth="8" fill="none"
                        strokeDasharray={2 * Math.PI * 140}
                        strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="z-10 space-y-2">
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-sm">Elapsed Time</p>
                    <div className="text-6xl font-black text-white font-mono">{elapsed}</div>
                    <div className="text-orange-500 font-bold">{data.fasting.targetHours} Hours Goal</div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-zinc-400">
                    {data.fasting.isActive
                        ? "คุณกำลังอยู่ในช่วงอดอาหาร (Fasting Phase)... สู้ๆ!"
                        : "พร้อมเริ่มการอดอาหารรอบถัดไปหรือยัง?"}
                </p>

                <Button
                    onClick={toggleFasting}
                    className={`w-full max-w-sm py-6 text-xl font-bold rounded-full transition-all shadow-lg hover:scale-105 ${data.fasting.isActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                >
                    {data.fasting.isActive ? (
                        <span className="flex items-center gap-2"><Utensils className="w-5 h-5" /> End Fast (เริ่มทาน)</span>
                    ) : (
                        <span className="flex items-center gap-2"><Play className="w-5 h-5 fill-current" /> Start Fasting</span>
                    )}
                </Button>
            </div>
        </div>
    );
}

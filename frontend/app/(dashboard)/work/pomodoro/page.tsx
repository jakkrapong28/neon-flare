"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, CheckCircle } from "lucide-react";

export default function PomodoroPage() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound?
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (m: 'FOCUS' | 'BREAK') => {
        setMode(m);
        setTimeLeft(m === 'FOCUS' ? 25 * 60 : 5 * 60);
        setIsActive(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((mode === 'FOCUS' ? (25 * 60) : (5 * 60)) - timeLeft) / (mode === 'FOCUS' ? (25 * 60) : (5 * 60)) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <CheckCircle className="w-8 h-8 text-violet-500" />
                จับเวลาโฟกัส (Pomodoro)
            </h1>

            <div className="relative w-80 h-80 flex items-center justify-center group">
                {/* Circular Progress (SVG) */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="160" cy="160" r="140" stroke="#27272a" strokeWidth="12" fill="none" />
                    <circle
                        cx="160" cy="160" r="140"
                        stroke={mode === 'FOCUS' ? "#8b5cf6" : "#22c55e"}
                        strokeWidth="12" fill="none"
                        strokeDasharray={2 * Math.PI * 140}
                        strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                <div className="text-center z-10">
                    <div className="text-7xl font-black text-white font-mono tracking-wider">
                        {formatTime(timeLeft)}
                    </div>
                    <p className={`mt-2 font-bold ${mode === 'FOCUS' ? 'text-violet-400' : 'text-emerald-400'}`}>
                        {mode === 'FOCUS' ? 'ลุยงานให้เต็มที่ (DO THE WORK)' : 'พักผ่อนสักนิด (TAKE A BREAK)'}
                    </p>

                    {!isActive && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full backdrop-blur-sm">
                            <input
                                type="range"
                                min="1"
                                max="60"
                                className="w-1/2 accent-violet-500"
                                onChange={(e) => setTimeLeft(parseInt(e.target.value) * 60)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={toggleTimer}
                    className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 text-lg shadow-xl hover:scale-105 transition-all
                    ${isActive ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
                >
                    {isActive ? <Pause /> : <Play />} {isActive ? 'หยุดชั่วคราว' : 'เริ่มจับเวลา'}
                </button>
                <button onClick={resetTimer} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white">
                    <RotateCcw />
                </button>
            </div>

            <div className="flex gap-4 p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                <button onClick={() => switchMode('FOCUS')} className={`px-6 py-2 rounded-lg font-bold transition-colors ${mode === 'FOCUS' ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                    โฟกัส (25 น.)
                </button>
                <button onClick={() => switchMode('BREAK')} className={`px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${mode === 'BREAK' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                    <Coffee className="w-4 h-4" /> พักเบรก (5 น.)
                </button>
            </div>
        </div >
    );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CloudRain, Coffee, Volume2, VolumeX } from "lucide-react";

export function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"FOCUS" | "SHORT" | "LONG">("FOCUS");
    const [sound, setSound] = useState<"NONE" | "RAIN" | "CAFE">("NONE");

    // Audio Refs (Mock URLs for demo, replace with real assets)
    const rainRef = useRef<HTMLAudioElement | null>(null);
    const cafeRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        if (typeof window !== "undefined") {
            rainRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3"); // Free asset
            rainRef.current.loop = true;
            cafeRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3"); // Free asset
            cafeRef.current.loop = true;
        }
        return () => {
            rainRef.current?.pause();
            cafeRef.current?.pause();
        }
    }, []);

    useEffect(() => {
        // Handle Sound Playback
        if (isActive) {
            if (sound === "RAIN") { rainRef.current?.play(); cafeRef.current?.pause(); }
            else if (sound === "CAFE") { cafeRef.current?.play(); rainRef.current?.pause(); }
            else { rainRef.current?.pause(); cafeRef.current?.pause(); }
        } else {
            rainRef.current?.pause();
            cafeRef.current?.pause();
        }
    }, [isActive, sound]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3");
            audio.play();
            alert("Session Completed! Take a break.");
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleMode = () => {
        if (mode === "FOCUS") { setMode("SHORT"); setTimeLeft(5 * 60); }
        else if (mode === "SHORT") { setMode("LONG"); setTimeLeft(15 * 60); }
        else { setMode("FOCUS"); setTimeLeft(25 * 60); }
        setIsActive(false);
    };

    return (
        <div className="rounded-xl border border-violet-500/20 bg-zinc-950/80 p-6 flex flex-col items-center justify-center shadow-lg shadow-violet-500/10 relative overflow-hidden">
            {/* Pulse Effect when Active */}
            {isActive && (
                <div className="absolute inset-0 bg-violet-500/5 animate-pulse rounded-xl pointer-events-none"></div>
            )}

            <div className="mb-6 flex gap-2 z-10">
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${mode === 'FOCUS' ? 'bg-violet-500/20 text-violet-300 border-violet-500/50' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                >
                    FOCUS
                </button>
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${mode === 'SHORT' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                >
                    SHORT
                </button>
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${mode === 'LONG' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                >
                    LONG
                </button>
            </div>

            <div className="relative z-10">
                <div className={`text-7xl font-black tabular-nums tracking-tighter mb-8 bg-gradient-to-br from-white ${isActive ? 'to-violet-400' : 'to-zinc-500'} bg-clip-text text-transparent transition-all duration-500 scale-100`}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex items-center gap-6 z-10">
                <button
                    onClick={() => { setIsActive(false); setTimeLeft(mode === 'FOCUS' ? 25 * 60 : mode === 'SHORT' ? 5 * 60 : 15 * 60); }}
                    className="p-4 rounded-full bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition border border-zinc-800"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`p-6 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 ${isActive ? 'bg-rose-500 shadow-rose-500/30' : 'bg-violet-500 shadow-violet-500/30'} text-white`}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current pl-1" />}
                </button>

                {/* Sound Toggle */}
                <div className="relative group">
                    <button className="p-4 rounded-full bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition border border-zinc-800">
                        {sound === "NONE" ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
                    </button>
                    {/* Sound Menu */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-950 border border-zinc-700 rounded-lg p-2 flex flex-col gap-1 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                        <button onClick={() => setSound("NONE")} className={`p-2 rounded hover:bg-zinc-800 ${sound === "NONE" ? "text-white bg-zinc-800" : "text-zinc-500"}`} title="Mute"><VolumeX className="w-4 h-4" /></button>
                        <button onClick={() => setSound("RAIN")} className={`p-2 rounded hover:bg-zinc-800 ${sound === "RAIN" ? "text-cyan-400 bg-cyan-900/20" : "text-zinc-500"}`} title="Rain"><CloudRain className="w-4 h-4" /></button>
                        <button onClick={() => setSound("CAFE")} className={`p-2 rounded hover:bg-zinc-800 ${sound === "CAFE" ? "text-amber-400 bg-amber-900/20" : "text-zinc-500"}`} title="Cafe"><Coffee className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-xs text-zinc-500 font-medium tracking-wide z-10">
                {isActive ? "STAY FOCUSED" : "READY TO WORK?"}
            </p>
        </div>
    );
}

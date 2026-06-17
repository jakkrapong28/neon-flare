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
            setTimeout(() => {
                setIsActive(false);
            }, 0);
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
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center shadow-sm relative overflow-hidden text-foreground">
            {/* Pulse Effect when Active */}
            {isActive && (
                <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-xl pointer-events-none"></div>
            )}

            <div className="mb-6 flex gap-2 z-10">
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${mode === 'FOCUS' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                >
                    FOCUS
                </button>
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${mode === 'SHORT' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                >
                    SHORT
                </button>
                <button
                    onClick={toggleMode}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${mode === 'LONG' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                >
                    LONG
                </button>
            </div>

            <div className="relative z-10">
                <div className={`text-7xl font-black tabular-nums tracking-tighter mb-8 bg-gradient-to-br from-foreground ${isActive ? 'to-primary/70' : 'to-muted-foreground/70'} bg-clip-text text-transparent transition-all duration-500 scale-100`}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex items-center gap-6 z-10">
                <button
                    onClick={() => { setIsActive(false); setTimeLeft(mode === 'FOCUS' ? 25 * 60 : mode === 'SHORT' ? 5 * 60 : 15 * 60); }}
                    className="p-4 rounded-full bg-secondary text-muted-foreground hover:bg-zinc-200 hover:text-foreground transition border border-border"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`p-6 rounded-full transition-all shadow-md hover:scale-105 active:scale-95 ${isActive ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground'}`}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current pl-1" />}
                </button>

                {/* Sound Toggle */}
                <div className="relative group">
                    <button className="p-4 rounded-full bg-secondary text-muted-foreground hover:bg-zinc-200 hover:text-foreground transition border border-border">
                        {sound === "NONE" ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-600" />}
                    </button>
                    {/* Sound Menu */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg p-2 flex flex-col gap-1 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                        <button onClick={() => setSound("NONE")} className={`p-2 rounded hover:bg-secondary ${sound === "NONE" ? "text-foreground bg-secondary" : "text-muted-foreground"}`} title="Mute"><VolumeX className="w-4 h-4" /></button>
                        <button onClick={() => setSound("RAIN")} className={`p-2 rounded hover:bg-secondary ${sound === "RAIN" ? "text-cyan-600 bg-cyan-500/10" : "text-muted-foreground"}`} title="Rain"><CloudRain className="w-4 h-4" /></button>
                        <button onClick={() => setSound("CAFE")} className={`p-2 rounded hover:bg-secondary ${sound === "CAFE" ? "text-amber-600 bg-amber-500/10" : "text-muted-foreground"}`} title="Cafe"><Coffee className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground font-medium tracking-wide z-10">
                {isActive ? "STAY FOCUSED" : "READY TO WORK?"}
            </p>
        </div>
    );
}

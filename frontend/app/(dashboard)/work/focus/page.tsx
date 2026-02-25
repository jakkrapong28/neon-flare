"use client";

import { useState, useEffect } from "react";
import { Maximize, Minimize, Moon, Zap, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FocusModePage() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const router = useRouter();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

            <div className="relative z-10 text-center space-y-12 animate-in fade-in duration-1000 zoom-in-95 max-w-4xl">

                <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                    <Zap className="w-32 h-32 text-indigo-400 mx-auto relative z-10" strokeWidth={1} />
                </div>

                <div className="space-y-4">
                    <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase glow-text select-none">
                        Focus
                    </h1>
                    <p className="text-2xl text-indigo-200/50 font-light tracking-[0.2em] uppercase">
                        Deep Work Session
                    </p>
                </div>

                <p className="text-xl text-zinc-500 font-light tracking-wide max-w-md mx-auto leading-relaxed italic">
                    "The successful warrior is the average man, with laser-like focus."
                </p>

                <div className="flex gap-6 justify-center mt-12">
                    <button onClick={toggleFullscreen} className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
                        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                        {isFullscreen ? "Exit Fullscreen" : "Enter Zone"}
                    </button>
                    <button onClick={() => router.back()} className="px-10 py-5 bg-zinc-900 text-white border border-zinc-800 font-bold rounded-full hover:bg-zinc-800 transition-all flex items-center gap-3 hover:border-indigo-500/50">
                        <ChevronLeft className="w-5 h-5" />
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}

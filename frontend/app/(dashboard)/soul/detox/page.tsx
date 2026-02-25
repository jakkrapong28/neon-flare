"use client";

import { useSoulSystem } from "@/hooks/useSoulSystem";
import { Smartphone, Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DetoxPage() {
    const { addDetoxSession, data } = useSoulSystem();
    const [isLocked, setIsLocked] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLocked) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isLocked]);

    const handleStop = () => {
        setIsLocked(false);
        addDetoxSession(seconds);
        setSeconds(0);
    };

    const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate total detox time today
    const today = new Date().toISOString().split('T')[0];
    const totalToday = data.detox.filter(d => d.date === today).reduce((acc, c) => acc + c.duration, 0);

    return (
        <div className="max-w-3xl mx-auto py-12 text-center">
            <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2 mb-12">
                <Smartphone className="w-8 h-8 text-emerald-400" />
                Digital Detox
            </h1>

            {isLocked ? (
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-12 rounded-3xl space-y-8 animate-pulse">
                    <Lock className="w-24 h-24 text-emerald-500 mx-auto" />
                    <div>
                        <p className="text-emerald-200/50 text-xl font-bold uppercase tracking-widest">Phone Locked</p>
                        <p className="text-8xl font-black text-white font-mono my-4">{formatTime(seconds)}</p>
                    </div>
                    <p className="text-emerald-400 font-bold">Put your phone down. Enjoy Real Life.</p>

                    <Button onClick={handleStop} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6 px-8 rounded-full">
                        <Unlock className="w-5 h-5 mr-2" /> Stop Session
                    </Button>
                </div>
            ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl space-y-8">
                    <div className="w-40 h-40 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border-4 border-zinc-800">
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">{(totalToday / 60).toFixed(0)}</p>
                            <p className="text-xs text-zinc-500 uppercase">Mins Today</p>
                        </div>
                    </div>

                    <p className="text-zinc-400 max-w-md mx-auto">
                        Disconnect to reconnect. Start a session to track your screen-free time.
                    </p>

                    <Button onClick={() => setIsLocked(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl py-8 px-12 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105">
                        Start Detox
                    </Button>
                </div>
            )}
        </div>
    );
}

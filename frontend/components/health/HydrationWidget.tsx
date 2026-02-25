"use client";
import { useState, useEffect } from "react";
import { Plus, Minus, Droplets } from "lucide-react";

export function HydrationWidget() {
    const [glasses, setGlasses] = useState(0);
    const [rippling, setRippling] = useState(false);

    // Load from local storage for MVP (or fetch from API if we had GET /health/hydration)
    useEffect(() => {
        const saved = localStorage.getItem("hydration_today");
        if (saved) setGlasses(parseInt(saved));
    }, []);

    const addGlass = () => {
        const newVal = glasses + 1;
        setGlasses(newVal);
        localStorage.setItem("hydration_today", newVal.toString());
        setRippling(true);
        setTimeout(() => setRippling(false), 500); // Reset animation
    };

    const removeGlass = () => {
        if (glasses > 0) {
            const newVal = glasses - 1;
            setGlasses(newVal);
            localStorage.setItem("hydration_today", newVal.toString());
        }
    };

    const goal = 8;
    const progress = Math.min((glasses / goal) * 100, 100);

    return (
        <div className="rounded-xl border border-cyan-500/30 bg-zinc-950/80 shadow-lg shadow-cyan-500/10 p-6 relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-cyan-400" />
                        ดื่มน้ำ (Hydration)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">เป้าหมาย: {goal} แก้ว/วัน</p>
                </div>
                <div className="text-3xl font-black text-cyan-400">{glasses}</div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 relative z-10">
                <button
                    onClick={removeGlass}
                    className="p-2 rounded-full bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-zinc-400 hover:text-cyan-500 transition-all"
                >
                    <Minus className="w-5 h-5" />
                </button>

                <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="relative">
                    <button
                        onClick={addGlass}
                        className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
                    >
                        <Plus className="w-6 h-6 font-bold" />
                    </button>
                    {/* Ripple Effect Element */}
                    {rippling && (
                        <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75"></span>
                    )}
                </div>
            </div>

            {/* Background Wave */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-10 pointer-events-none">
                <div className="absolute bottom-0 w-[200%] h-full bg-cyan-500 rounded-full filter blur-xl animate-wave" style={{
                    transform: `translateY(${100 - progress}%)`
                }}></div>
            </div>
        </div>
    );
}

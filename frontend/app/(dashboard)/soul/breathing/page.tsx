"use client";

import { useState, useEffect } from "react";
import { Wind, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BreathingPage() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
    const [guide, setGuide] = useState("พร้อมไหม?");

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            // 4-7-8 Breathing
            const cycle = async () => {
                setPhase('Inhale'); setGuide("หายใจเข้า (4s)");
                await new Promise(r => setTimeout(r, 4000));

                if (!isActive) return;
                setPhase('Hold'); setGuide("กลั้นหายใจ (7s)");
                await new Promise(r => setTimeout(r, 7000));

                if (!isActive) return;
                setPhase('Exhale'); setGuide("หายใจออก (8s)");
                await new Promise(r => setTimeout(r, 8000));

                if (isActive) cycle();
            };
            cycle();
        } else {
            setGuide("พร้อมไหม?");
            setPhase('Inhale');
        }
        return () => { };
    }, [isActive]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-black pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-12">
                <h1 className="text-2xl font-bold text-cyan-200/50 uppercase tracking-[0.3em]">ฝึกหายใจ (Breathing)</h1>

                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Ripple/Circle Animation */}
                    <motion.div
                        className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl"
                        animate={
                            isActive ? {
                                scale: phase === 'Inhale' ? [1, 1.5] : phase === 'Hold' ? 1.5 : [1.5, 1],
                                opacity: phase === 'Exhale' ? [0.5, 0.2] : 0.5
                            } : { scale: 1 }
                        }
                        transition={{ duration: phase === 'Inhale' ? 4 : phase === 'Hold' ? 0 : 8, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="w-48 h-48 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.4)]"
                        animate={
                            isActive ? {
                                scale: phase === 'Inhale' ? [1, 1.5] : phase === 'Hold' ? 1.5 : [1.5, 1],
                            } : { scale: 1 }
                        }
                        transition={{ duration: phase === 'Inhale' ? 4 : phase === 'Hold' ? 0 : 8, ease: "easeInOut" }}
                    >
                        <span className="text-2xl font-black text-black">{guide}</span>
                    </motion.div>
                </div>

                <Button
                    onClick={() => setIsActive(!isActive)}
                    className={`rounded-full px-12 py-8 text-xl font-bold transition-all ${isActive ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-cyan-500 hover:bg-cyan-400 text-black'}`}
                >
                    {isActive ? <Square className="w-6 h-6 fill-current mr-2" /> : <Play className="w-6 h-6 fill-current mr-2" />}
                    {isActive ? "หยุด" : "เริ่มฝึก"}
                </Button>
            </div>
        </div>
    );
}

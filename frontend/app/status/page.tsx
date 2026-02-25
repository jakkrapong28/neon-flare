"use client";

import React, { useState } from 'react';

import { StatCard } from '@/components/status/StatCard';
import { AiChatOverlay } from '@/components/status/AiChatOverlay';
import { FloatingChatWidget } from '@/components/status/FloatingChatWidget';
import { useLifeStatus } from '@/hooks/useLifeStatus';
import { HeartPulse, Zap, Wallet, Activity, Calendar, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CyberneticReactor } from "@/components/3d/CyberneticReactor";
import { EffectComposer, Bloom, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2 } from "three";

export default function StatusHubPage() {
    const [date, setDate] = useState(new Date());
    // Destructure new fields from the hook
    const { soul, wealth, power, state, action, loading } = useLifeStatus(date);

    // Date Navigation helpers
    const changeDate = (days: number) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        setDate(newDate);
    };

    const isToday = new Date().toDateString() === date.toDateString();

    // Use loading or fallback for overall
    const overall = loading ? 0 : Math.round((soul + wealth + power) / 3);

    // Stagger animation for cards
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const isCrisis = state === 'CRISIS';

    return (
        <div className="min-h-screen w-full bg-[#0a0a0f] bg-grid-pattern overflow-hidden relative text-slate-200">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Header / HUD Top */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-mono">
                        LIFE.OS <span className="text-xs text-slate-500 font-normal align-top ml-1">v2.4</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Status Hub // Active</p>
                </div>
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-slate-800 pointer-events-auto">
                    <Button variant="ghost" size="icon" onClick={() => changeDate(-1)} className="h-8 w-8 text-slate-400 hover:text-white">
                        <ChevronLeft size={16} />
                    </Button>
                    <div className="flex flex-col items-center min-w-[100px]">
                        <span className="text-sm font-bold text-white font-mono">{date.toLocaleDateString()}</span>
                        <span className="text-xs text-slate-500">{isToday ? 'TODAY' : 'HISTORY'}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => changeDate(1)} disabled={isToday} className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30">
                        <ChevronRight size={16} />
                    </Button>
                </div>

                <div className="text-right">
                    <div className="text-sm font-mono text-cyan-500">{new Date().toLocaleDateString()}</div>
                    <div className="text-xs text-slate-600 font-mono">{new Date().toLocaleTimeString()}</div>
                </div>
            </header>

            <main className="relative z-10 container mx-auto h-screen flex flex-col md:flex-row items-center justify-center gap-12 p-4">

                {/* Left Column - Stats */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex-1 w-full max-w-sm space-y-4 order-2 md:order-1"
                >
                    <motion.div variants={item}>
                        <StatCard
                            title="จิตวิญญาณ (Soul)"
                            value={soul}
                            icon={HeartPulse}
                            color="text-red-500"
                            progressColor="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        />
                    </motion.div>
                    <motion.div variants={item}>
                        <StatCard
                            title="พลังงาน (Power)"
                            value={power}
                            icon={Zap}
                            color="text-red-500"
                            progressColor="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        />
                    </motion.div>
                </motion.div>

                {/* Center - 3D Cybernetic Core (Expanded) */}
                <div className="flex-none order-1 md:order-2 flex flex-col items-center w-[400px] h-[500px] relative">
                    <div className="absolute inset-0 z-0">
                        {/* 3D Canvas */}
                        <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 10]} intensity={1} />
                            <pointLight position={[-5, -5, 5]} intensity={1} color={isCrisis ? "red" : "blue"} />

                            <CyberneticReactor soul={soul} state={state} />

                            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />

                            {/* Post Processing Effects */}
                            <EffectComposer>
                                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={isCrisis ? 1.5 : 0.5} />
                                {isCrisis ? (
                                    <Glitch
                                        delay={new Vector2(1.5, 3.5)}
                                        duration={new Vector2(0.6, 1.0)}
                                        strength={new Vector2(0.3, 1.0)}
                                        mode={GlitchMode.SPORADIC}
                                        active
                                        ratio={0.85}
                                    />
                                ) : <></>}
                            </EffectComposer>
                        </Canvas>
                    </div>

                    {/* Overall Status Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-auto mb-8 text-center z-10 relative"
                    >
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border backdrop-blur-md ${isCrisis ? 'bg-red-900/50 border-red-500 animate-pulse' : 'bg-slate-900/80 border-slate-700'}`}>
                            <Activity className={loading ? "animate-spin text-slate-400" : isCrisis ? "text-red-400" : "text-green-400"} size={20} />
                            <span className="font-mono text-lg tracking-widest text-slate-300">
                                SYSTEM STATUS: <span className={isCrisis ? "text-red-500 font-black" : "text-white font-bold"}>
                                    {loading ? "SCANNING..." : state}
                                </span>
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Finance & Misc */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex-1 w-full max-w-sm space-y-4 order-3"
                >
                    <motion.div variants={item}>
                        <StatCard
                            title="ความมั่งคั่ง (Wealth)"
                            value={wealth}
                            icon={Wallet}
                            color="text-yellow-500"
                            progressColor="bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                        />
                    </motion.div>

                    {/* Placeholder for future module */}
                    <motion.div variants={item}>
                        <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-black/20 text-center">
                            <p className="text-xs text-slate-500 font-mono">MODULE EMPTY // SLOT AVAILABLE</p>
                        </div>
                    </motion.div>
                </motion.div>

            </main>

            {/* AI Chat Overlay */}
            <FloatingChatWidget date={date} />

            {/* Grid overlay for cyberpunk effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,23,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,23,0)_2px,transparent_2px)] bg-[size:40px_40px] pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] z-0" style={{ backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(to right, #1f2937 1px, transparent 1px)' }}></div>
        </div>
    );
}

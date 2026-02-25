"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, MessageCircle, Zap, TrendingUp, Heart } from "lucide-react";
import { NeonChatWidget, NeonChatWidgetRef } from "@/components/dashboard/NeonChatWidget";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CyberneticReactor } from "@/components/3d/CyberneticReactor";
import { EffectComposer, Bloom, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2 } from "three";

// Reusing types/logic from AvatarWidget but optimized for single-fetch
interface LifeStatusResponse {
    scores: {
        soul: number;
        wealth: number;
        power: number;
    };
    state: string;
    recommendedAction: string;
}

export default function StatusDetailPage() {
    const t = useTranslations('StatusDetail');
    const router = useRouter();
    const chatRef = useRef<NeonChatWidgetRef>(null);

    const [data, setData] = useState<LifeStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch ONCE on mount
    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem("authToken");

            // Auto-fix: Try legacy token if authToken missing
            if (!token) {
                const legacy = localStorage.getItem("token");
                if (legacy) {
                    token = legacy;
                    localStorage.setItem("authToken", legacy);
                } else {
                    console.warn("No token found, redirecting to login");
                    // Implement redirect or just show warning for now if no login page existed in context
                    // For safety, we'll try to fetch anyway to trigger 401 if token is bad, or just let strict auth handle it.
                    // But to avoid "50% fake", we should set loading false or error.
                    // Let's redirect to home or show error.
                    // router.push('/login'); // Assuming login exists
                    setLoading(false);
                    return;
                }
            }

            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
                const res = await axios.get(`${baseUrl}/api/v1/life-OS/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error: any) {
                console.error("Failed to fetch status:", error);
                if (error.response?.status === 401) {
                    // Token expired/invalid
                    localStorage.removeItem("authToken"); // Clear bad token
                    // router.push('/login'); 
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper for Avatar Visuals
    const currentState = data?.state || 'STABLE';

    const stateToThai: Record<string, string> = {
        'SUPER NEON': 'ซูเปอร์นีออน',
        'STABLE': 'ปกติ',
        'LOW BATTERY': 'แบตเตอรี่ต่ำ',
        'CRISIS': 'วิกฤต',
        'LOADING': 'กำลังโหลด...'
    };

    // Memoized Visual State - 3D ONLY properties
    const visual = useMemo(() => {
        const getAvatarState = (level: string) => {
            switch (level) {
                case 'SUPER NEON': return { color: "from-emerald-400 to-green-600", shadow: "shadow-emerald-500/50", glow: "emerald" };
                case 'STABLE': return { color: "from-blue-400 to-cyan-600", shadow: "shadow-blue-500/50", glow: "blue" };
                case 'LOW BATTERY': return { color: "from-yellow-400 to-orange-600", shadow: "shadow-yellow-500/50", glow: "yellow" };
                case 'CRISIS': return { color: "from-rose-400 to-red-600", shadow: "shadow-rose-500/50", glow: "rose" };
                default: return { color: "from-zinc-400 to-zinc-600", shadow: "shadow-zinc-500/30", glow: "zinc" };
            }
        };
        return getAvatarState(currentState);
    }, [currentState]);

    // Default Scores
    const wealth = data?.scores.wealth || 50;
    const power = data?.scores.power || 50;
    const soul = data?.scores.soul || 50;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
                    <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">Initializing System...</div>
                </div>
            </div>
        );
    }

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black z-0"></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-${visual.glow}-500/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000`}></div>

            {/* Content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 container mx-auto px-4 py-8 h-full flex flex-col items-center justify-center min-h-screen"
            >
                {/* Header / Back Button */}
                <motion.div variants={item} className="absolute top-6 left-6 md:top-10 md:left-10 z-50">
                    <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group text-sm font-medium text-zinc-300 hover:text-white">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t('back')}
                    </Link>
                </motion.div>

                {/* Main Avatar Section - FULL BODY / UNCROPPED */}
                <motion.div variants={item} className="relative mb-12 flex justify-center items-center h-[500px]">
                    {/* 3D Cybernetic Reactor - NO IMAGE */}
                    <div className="relative z-20 w-[400px] h-[500px]">
                        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 10]} intensity={1} />
                            <pointLight position={[-5, -5, 5]} intensity={1} color={currentState === 'CRISIS' ? "red" : "blue"} />

                            <CyberneticReactor soul={soul} state={currentState} />

                            <OrbitControls enableZoom={false} enablePan={false} />

                            <EffectComposer>
                                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={currentState === 'CRISIS' ? 1.5 : 0.5} />
                                <Glitch
                                    delay={new Vector2(1.5, 3.5)}
                                    duration={new Vector2(0.6, 1.0)}
                                    strength={new Vector2(0.3, 1.0)}
                                    mode={GlitchMode.SPORADIC}
                                    active={currentState === 'CRISIS'}
                                    ratio={0.85}
                                />
                            </EffectComposer>
                        </Canvas>
                    </div>

                    {/* Orbiting Stats - Re-positioned for Full Body */}
                    {/* Wealth (Gold) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-1/4 -left-8 md:-left-24 flex flex-col items-end cursor-pointer will-change-transform z-30"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-yellow-400 font-bold text-shadow-sm font-thai">การเงิน</span>
                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center backdrop-blur-md">
                                <TrendingUp className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>
                        <div className="h-2 w-32 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${wealth}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                            ></motion.div>
                        </div>
                        <span className="text-2xl font-black text-white mt-1">{wealth}%</span>
                    </motion.div>

                    {/* Power (Red) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute top-1/4 -right-8 md:-right-24 flex flex-col items-start z-30"
                    >
                        <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                            <span className="text-red-500 font-bold text-shadow-sm font-thai">พลังงาน</span>
                            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center backdrop-blur-md">
                                <Zap className="w-6 h-6 text-red-500" />
                            </div>
                        </div>
                        <div className="h-2 w-32 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${power}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="h-full bg-gradient-to-r from-red-600 to-red-500"
                            ></motion.div>
                        </div>
                        <span className="text-2xl font-black text-white mt-1">{power}%</span>
                    </motion.div>

                    {/* Soul (Purple) */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 transform translate-y-12"
                    >
                        <div className="h-2 w-48 bg-zinc-800 rounded-full overflow-hidden border border-white/5 mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${soul}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                            ></motion.div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center backdrop-blur-md">
                                <Heart className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-purple-400 font-bold text-shadow-sm font-thai">จิตใจ</span>
                            <span className="text-xl font-black text-white">{soul}%</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Status Text */}
                <motion.div variants={item} className="text-center mt-24 md:mt-16 z-20">
                    <h1 className={`text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r ${visual.color} bg-clip-text text-transparent mb-4 drop-shadow-2xl`}>
                        {stateToThai[currentState] || currentState}
                    </h1>
                    <p className="text-xl text-zinc-300 font-light max-w-lg mx-auto leading-relaxed border-l-4 border-zinc-700 pl-4 italic">
                        "{data?.recommendedAction || 'กำลังวิเคราะห์สถานะ...'}"
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={item} className="mt-12 flex gap-4 z-20">
                    <button
                        onClick={() => chatRef.current?.analyze()}
                        className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 group shadow-xl"
                    >
                        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/40">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{t('chat_with_me')}</div>
                            <div className="text-sm font-medium text-white">{t('chat_desc')}</div>
                        </div>
                    </button>
                </motion.div>
            </motion.div>

            {/* Hidden Chat Widget Logic */}
            <NeonChatWidget ref={chatRef} hideTrigger={true} />
        </div>
    );
}

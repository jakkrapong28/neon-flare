import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface AvatarDisplayProps {
    status: number; // 0-100
    loading?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ status, loading }) => {
    // Determine state based on status
    const isCritical = status < 50;
    const isOptimal = status >= 80;

    // Animation variants
    const containerVariants = {
        idle: {
            y: [0, -20, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as any
            }
        },
        critical: {
            y: [0, -5, 0],
            opacity: 0.8,
            filter: "grayscale(80%)",
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as any
            }
        }
    };

    // Style classes based on status
    const getGlowEffect = () => {
        if (loading) return "shadow-[0_0_15px_rgba(255,255,255,0.2)]";
        if (isCritical) return "shadow-[0_0_10px_rgba(100,100,100,0.3)] border-slate-700";
        if (isOptimal) return "shadow-[0_0_50px_rgba(0,255,255,0.6)] border-cyan-400 animate-pulse-slow";
        return "shadow-[0_0_30px_rgba(59,130,246,0.5)] border-blue-500";
    };

    const getFilter = () => {
        if (loading) return "blur-sm grayscale";
        if (isCritical) return "grayscale brightness-75 sepia-50";
        if (isOptimal) return "brightness-110 contrast-125 saturate-150";
        return "none";
    };

    return (
        <div className="relative flex items-center justify-center w-[300px] h-[400px]">
            {/* Background Aura */}
            <motion.div
                className={cn(
                    "absolute inset-0 rounded-full blur-[80px] z-0 transition-colors duration-1000",
                    isCritical ? "bg-gray-800/40" : isOptimal ? "bg-cyan-500/30" : "bg-blue-600/30"
                )}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                }}
            />

            {/* Avatar Container */}
            <motion.div
                variants={containerVariants}
                animate={isCritical ? "critical" : "idle"}
                className={cn(
                    "relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full border-4 overflow-hidden bg-black flex items-center justify-center transition-all duration-700",
                    getGlowEffect()
                )}
                style={{ filter: getFilter() }}
            >
                {/* Placeholder Avatar Image - Replace with real asset later */}
                {/* SVG Avatar Representation */}
                <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                    <circle cx="100" cy="90" r="40" className={cn("fill-current", isCritical ? "text-slate-500" : isOptimal ? "text-cyan-300" : "text-blue-300")} />
                    <path d="M 40 180 Q 100 220 160 180 L 160 200 L 40 200 Z" className={cn("fill-current", isCritical ? "text-slate-600" : isOptimal ? "text-cyan-600" : "text-blue-600")} />

                    {/* Eyes */}
                    <ellipse cx="85" cy="85" rx="5" ry="8" className="fill-black opacity-60" />
                    <ellipse cx="115" cy="85" rx="5" ry="8" className="fill-black opacity-60" />

                    {/* Expression */}
                    {isCritical ? (
                        <path d="M 85 110 Q 100 100 115 110" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    ) : (
                        <path d="M 85 105 Q 100 120 115 105" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    )}
                </svg>

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="w-8 h-8 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </motion.div>

            {/* Status Text Overlay when critical */}
            {isCritical && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 bg-red-900/80 text-red-200 px-4 py-1 rounded-full border border-red-500/50 backdrop-blur-sm"
                >
                    SYSTEM GLITCH // RECHARGE REQUIRED
                </motion.div>
            )}
        </div>
    );
};

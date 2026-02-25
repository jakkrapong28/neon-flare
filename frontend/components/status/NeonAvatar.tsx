"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type AvatarState = 'SUPER NEON' | 'STABLE' | 'LOW BATTERY' | 'CRISIS';

interface NeonAvatarProps {
    state: AvatarState | string;
    loading?: boolean;
}

export const NeonAvatar: React.FC<NeonAvatarProps> = ({ state, loading }) => {
    // Normalize state for robust matching
    const currentState = loading ? 'LOADING' : (state as AvatarState);

    // --- Animation Variants ---

    // Body Container: Controls overall posture
    const bodyVariants = {
        'SUPER NEON': {
            scale: 1.1,
            y: 0,
            transition: { duration: 0.5 }
        },
        'STABLE': {
            scale: 1,
            y: [0, -8, 0], // DEEP visible breathing
            scaleY: [0.98, 1.05, 0.98], // Exaggerated breathing chest expansion
            transition: {
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scaleY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                duration: 0.5
            }
        },
        'LOW BATTERY': {
            scale: 0.95,
            y: 10,
            rotate: -2,
            transition: { duration: 0.8, ease: "easeInOut" as any }
        },
        'CRISIS': {
            scale: 0.95,
            y: 5,
            x: [0, -2, 2, -1, 1, 0], // Glitch shake
            transition: {
                y: { duration: 0.5 },
                x: { repeat: Infinity, duration: 0.2, repeatDelay: 2 }
            }
        },
        'LOADING': {
            opacity: 0.5,
            scale: 0.9,
            transition: { duration: 0.5 }
        }
    };

    // Color Palette based on State
    const colors = React.useMemo(() => {
        switch (currentState) {
            case 'SUPER NEON': return { primary: '#00f2ff', secondary: '#0062ff', glow: '0 0 50px #00f2ff' };
            case 'STABLE': return { primary: '#10b981', secondary: '#059669', glow: '0 0 30px #10b981' };
            case 'LOW BATTERY': return { primary: '#fbbf24', secondary: '#78350f', glow: 'none' };
            case 'CRISIS': return { primary: '#ef4444', secondary: '#7f1d1d', glow: '0 0 20px #ef4444' };
            default: return { primary: '#94a3b8', secondary: '#475569', glow: 'none' };
        }
    }, [currentState]);

    return (
        <div className="relative w-[300px] h-[400px] flex items-end justify-center perspective-1000">

            {/* Background Aura / Particles */}
            <AnimatePresence>
                {currentState === 'SUPER NEON' && (
                    <>
                        <motion.div
                            key="aura"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6, scale: [1, 1.2, 1] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,242,255,0.4)_0%,transparent_70%)] blur-2xl z-0"
                        />
                        {/* Particles */}
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={`p-${i}`}
                                className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-[1px]"
                                initial={{ y: 350, x: (i * 30) - 150, opacity: 0 }}
                                animate={{ y: 0, opacity: [0, 1, 0] }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </>
                )}
                {currentState === 'LOW BATTERY' && (
                    <motion.div
                        key="smoke"
                        className="absolute bottom-0 w-32 h-64 bg-slate-800/30 blur-2xl rounded-full"
                        animate={{ opacity: [0.2, 0.5, 0.2], y: [-10, -30, -10] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                )}
            </AnimatePresence>

            {/* Character Container */}
            <motion.div
                className="relative z-10 w-60 h-80"
                variants={bodyVariants}
                animate={currentState}
            >
                {/* SVG Character Construction */}
                <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">

                    {/* LEGS */}
                    <motion.path
                        d="M 70 300 L 75 200 L 95 200 L 90 300 Z"
                        fill="#1e293b"
                        stroke={colors.secondary}
                        strokeWidth="2"
                    />
                    <motion.path
                        d="M 130 300 L 125 200 L 105 200 L 110 300 Z"
                        fill="#1e293b"
                        stroke={colors.secondary}
                        strokeWidth="2"
                    />

                    {/* TORSO */}
                    <motion.path
                        animate={
                            currentState === 'SUPER NEON' ? { d: "M 60 80 L 140 80 L 130 200 L 70 200 Z" } : // Broad shoulders
                                currentState === 'LOW BATTERY' ? { d: "M 75 90 L 125 90 L 120 200 L 80 200 Z" } : // Slouched
                                    { d: "M 70 80 L 130 80 L 125 200 L 75 200 Z" } // Normal
                        }
                        fill="#0f172a"
                        stroke={colors.primary}
                        strokeWidth={currentState === 'SUPER NEON' ? 4 : 2}
                        className="transition-all duration-500"
                    />

                    {/* ARMOR / OUTFIT DETAILS */}
                    {currentState === 'SUPER NEON' && (
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            d="M 100 80 L 100 200 M 60 80 L 140 80"
                            stroke={colors.primary}
                            strokeWidth="3"
                            filter="url(#glow)"
                        />
                    )}
                    {currentState === 'CRISIS' && (
                        <motion.path
                            d="M 80 120 L 120 140 M 110 110 L 90 150"
                            stroke="#ef4444"
                            strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
                        />
                    )}

                    {/* HEAD */}
                    <motion.g
                        animate={
                            currentState === 'LOW BATTERY' ? { y: 15, rotate: 5, x: 5 } :
                                currentState === 'STABLE' ? { y: 0, rotate: [0, 3, 0, -3, 0], x: 0 } : // Increased Sway (from 1.5)
                                    { y: 0, rotate: 0, x: 0 }
                        }
                        transition={currentState === 'STABLE' ? {
                            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" } // Slower, deliberated sway
                        } : {}}
                        className="origin-bottom"
                    >
                        <rect x="80" y="30" width="40" height="50" rx="10" fill="#0f172a" stroke={colors.primary} strokeWidth="3" />

                        {/* EYES / VISOR */}
                        {currentState === 'SUPER NEON' ? (
                            <motion.rect
                                x="85" y="50" width="30" height="8"
                                fill={colors.primary}
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        ) : currentState === 'CRISIS' ? (
                            <g>
                                <motion.circle cx="90" cy="55" r="3" fill="red" />
                                <motion.circle cx="110" cy="55" r="3" fill="red" />
                            </g>
                        ) : (
                            <g>
                                <motion.rect
                                    x="88" y="52" width="6" height="6"
                                    fill={colors.primary}
                                    className="opacity-80"
                                    animate={{ opacity: [1, 1, 0, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1], repeatDelay: 0.5 }}
                                />
                                <motion.rect
                                    x="106" y="52" width="6" height="6"
                                    fill={colors.primary}
                                    className="opacity-80"
                                    animate={{ opacity: [1, 1, 0, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1], repeatDelay: 0.5 }}
                                />
                            </g>
                        )}
                    </motion.g>

                    {/* ARMS */}
                    {currentState === 'SUPER NEON' ? (
                        <g>
                            {/* Crossed Arms */}
                            <path d="M 60 80 L 40 150 L 80 150" stroke={colors.secondary} strokeWidth="6" fill="none" strokeLinecap="round" />
                            <path d="M 140 80 L 160 150 L 120 150" stroke={colors.secondary} strokeWidth="6" fill="none" strokeLinecap="round" />
                        </g>
                    ) : currentState === 'STABLE' || currentState === 'LOADING' ? (
                        <g>
                            {/* Idle Arms */}
                            <motion.path
                                d="M 70 80 L 50 160"
                                stroke="#1e293b" strokeWidth="6" strokeLinecap="round"
                                animate={{ rotate: [0, 2, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ originX: "70px", originY: "80px" }}
                            />
                            <motion.path
                                d="M 130 80 L 150 160"
                                stroke="#1e293b" strokeWidth="6" strokeLinecap="round"
                                animate={{ rotate: [0, -2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                style={{ originX: "130px", originY: "80px" }}
                            />
                        </g>
                    ) : (
                        <g>
                            {/* Dangling Arms (Low Battery/Crisis) */}
                            <path d="M 75 90 L 65 180" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                            <path d="M 125 90 L 135 180" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                        </g>
                    )}

                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>

                {/* Glitch Overlay for CRISIS */}
                {currentState === 'CRISIS' && (
                    <motion.div
                        className="absolute inset-0 bg-red-500/10 z-20 mix-blend-overlay"
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 3 }}
                    />
                )}

            </motion.div>
        </div>
    );
};

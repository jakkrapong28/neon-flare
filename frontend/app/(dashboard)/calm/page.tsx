"use client";

import { Canvas } from "@react-three/fiber";
import { CyberneticReactor } from "@/components/3d/CyberneticReactor";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vigilance } from "@react-three/postprocessing";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalmPage() {
    const [breatheMode, setBreatheMode] = useState(false);

    // Mock Soul Data
    const soul = {
        mood: "calm",
        clarity: 80,
        energy: 70
    };

    return (
        <div className="h-full flex flex-col relative bg-zinc-950 text-white overflow-hidden rounded-3xl m-4 shadow-2xl border border-zinc-900">
            {/* Overlay UI */}
            <div className="absolute top-0 left-0 right-0 p-8 z-10 flex justify-between items-start pointer-events-none">
                <div>
                    <h1 className="text-4xl font-light tracking-widest text-white/90">มุมพักใจ</h1>
                    <p className="text-white/50 font-light mt-1 text-sm tracking-wide">COSMIC SANCTUARY</p>
                </div>

                <div className="pointer-events-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBreatheMode(!breatheMode)}
                        className={`rounded-full w-12 h-12 transition-all duration-500 ${breatheMode ? 'bg-white/20 text-white' : 'bg-transparent text-white/50 hover:bg-white/10'}`}
                    >
                        <Wind className={`w-6 h-6 ${breatheMode ? 'animate-pulse' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Breathing Guide Overlay */}
            <AnimatePresence>
                {breatheMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"
                        />
                        <div className="text-center">
                            <motion.p
                                animate={{ opacity: [0, 1, 0, 1, 0] }}
                                transition={{ duration: 8, repeat: Infinity, times: [0, 0.2, 0.5, 0.8, 1] }}
                                className="text-2xl font-light text-blue-200 tracking-[0.2em]"
                            >
                                หายใจเข้า...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <color attach="background" args={['#050505']} />
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        autoRotate={!breatheMode}
                        autoRotateSpeed={0.5}
                        maxDistance={15}
                        minDistance={3}
                    />

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <CyberneticReactor soul={soul} state={breatheMode ? 'breathing' : 'idle'} />

                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                        <Noise opacity={0.05} />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center z-10 pointer-events-none">
                <p className="text-white/30 text-xs tracking-widest uppercase">
                    {breatheMode ? "Focus on your breath" : "Drag to Rotate • Scroll to Zoom"}
                </p>
            </div>
        </div>
    );
}

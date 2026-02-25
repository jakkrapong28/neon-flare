"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Droplets, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function WaterPage() {
    const { data, addWater } = useHealthSystem();
    const percentage = Math.min(100, Math.round((data.water.amount / data.water.goal) * 100));

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Droplets className="w-8 h-8 text-cyan-400" />
                ดื่มน้ำ (Hydration)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visualizer */}
                <div className="relative h-96 bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-end justify-center group">
                    <motion.div
                        className="absolute bottom-0 w-full bg-cyan-500/80 backdrop-blur-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        <div className="absolute top-0 w-full h-4 bg-white/20 animate-pulse" />
                        {/* Bubbles could go here */}
                    </motion.div>

                    <div className="relative z-10 mb-10 text-center">
                        <span className="text-6xl font-black text-white drop-shadow-lg">{percentage}%</span>
                        <p className="text-white/80 font-bold">{data.water.amount} / {data.water.goal} ml</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                        <h3 className="text-xl font-bold text-white mb-4">Quick Add</h3>
                        <button onClick={() => addWater(250)} className="p-4 bg-zinc-800 hover:bg-cyan-600 hover:text-white rounded-xl transition-all flex flex-col items-center gap-2 group">
                            <span className="font-bold">+250ml</span>
                        </button>
                        <button onClick={() => addWater(-250)} className="p-4 bg-zinc-800 hover:bg-red-500 hover:text-white rounded-xl transition-all flex flex-col items-center gap-2 group">
                            <span className="font-bold">-250ml</span>
                        </button>
                    </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <h3 className="text-xl font-bold text-white mb-4">Tips</h3>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li>• ดื่มน้ำ 1 แก้วหลังตื่นนอนช่วยกระตุ้นระบบเผาผลาญ</li>
                        <li>• ดื่มก่อนมื้ออาหารช่วยลดความอยากอาหาร</li>
                        <li>• เป้าหมายของคุณคือ 8 แก้ว (2000ml) ต่อวัน</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

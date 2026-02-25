import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import axios from "axios";
import { CyberneticReactor } from "@/components/3d/CyberneticReactor";

interface LifeStatusResponse {
    scores: {
        soul: number;
        wealth: number;
        power: number;
    };
    state: string;
    recommendedAction: string;
}

export function AvatarWidget() {
    const [data, setData] = useState<LifeStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScore = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
                const res = await axios.get(`${baseUrl}/api/v1/life-OS/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch life state:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScore();
    }, []);

    const currentState = data?.state || 'STABLE';
    // Normalize scores
    const soul = data?.scores.soul || 50;
    const wealth = data?.scores.wealth || 50;
    const power = data?.scores.power || 50;

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'SUPER NEON': return 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]';
            case 'CRISIS': return 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]';
            default: return 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]';
        }
    };

    return (
        <div className="relative p-6 rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-500 group h-[400px] flex flex-col items-center">

            {/* 3D Scene */}
            <div className="w-full h-48 mb-4 relative z-10">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />

                    <CyberneticReactor soul={soul} state={currentState} />

                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
                </Canvas>
            </div>

            <h3 className={`text-3xl font-black tracking-tight mb-1 font-thai ${getStatusColor(currentState)}`}>
                {currentState}
            </h3>
            <p className="text-sm text-zinc-300 font-medium mb-6 text-center italic opacity-80">
                "{data?.recommendedAction || 'Ready for instruction.'}"
            </p>

            {/* Stats Bars */}
            <div className="flex gap-4 w-full justify-center px-4 mt-auto">
                {/* Wealth */}
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-thai">
                        <span>ความมั่งคั่ง</span>
                        <span className="text-yellow-400">{wealth}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" style={{ width: `${wealth}%` }} />
                    </div>
                </div>

                {/* Power */}
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-thai">
                        <span>พลังงาน</span>
                        <span className="text-red-400">{power}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${power}%` }} />
                    </div>
                </div>

                {/* Soul */}
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-thai">
                        <span>จิตวิญญาณ</span>
                        <span className="text-purple-400">{soul}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: `${soul}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

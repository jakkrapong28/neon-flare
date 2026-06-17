"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Briefcase, X, User, Wallet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import axios from "axios";

// 3D R3F Imports
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CyberneticReactor } from "@/components/3d/CyberneticReactor";

import { CrisisDialog } from "@/components/dashboard/CrisisDialog";
import { EisenhowerMatrix } from "@/components/work/EisenhowerMatrix";
import { HabitTracker } from "@/components/health/HabitTracker";
import { NeonChatWidget } from "@/components/dashboard/NeonChatWidget";

// Crisis Categories
const CRISIS_MODES = [
  { id: 'money', label: 'สภาพคล่องตึงตัว', icon: Wallet, color: 'cyan', question: "เงินสดไม่พอ?", sub: "วิเคราะห์ & แก้ไข" },
  { id: 'work', label: 'งานล้นมือ', icon: Briefcase, color: 'pink', question: "งานเยอะทำไม่ทัน?", sub: "จัดลำดับความสำคัญ" },
  { id: 'burnout', label: 'หมดไฟ / เครียด', icon: Zap, color: 'green', question: "เหนื่อย หมดแรง?", sub: "เติมพลัง" },
  { id: 'urgent', label: 'เรื่องด่วนฉุกเฉิน', icon: AlertTriangle, color: 'rose', question: "เรื่องด่วนเข้ามา?", sub: "แผนรับมือ" },
];

export default function CommandPage() {
  const t = useTranslations('Dashboard');
  const [user, setUser] = useState("นายท่าน");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string[] | null>(null);
  const [mounted, setMounted] = useState(false);

  // Live score tracking state
  const [lifeScores, setLifeScores] = useState({
    soul: 75,
    wealth: 80,
    power: 70,
    state: "STABLE",
    recommendedAction: "Systems operating within nominal parameters."
  });

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUser(storedName);
    }
  }, []);

  // Fetch real life-OS status from NestJS API
  useEffect(() => {
    if (!mounted) return;

    const fetchLifeOSStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
        const res = await axios.get(`${baseUrl}/api/v1/life-OS/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          setLifeScores({
            soul: res.data.scores?.soul ?? 75,
            wealth: res.data.scores?.wealth ?? 80,
            power: res.data.scores?.power ?? 70,
            state: res.data.state ?? "STABLE",
            recommendedAction: res.data.recommendedAction ?? "Systems operating within nominal parameters."
          });
        }
      } catch (error) {
        console.error("Failed to fetch life OS status:", error);
      }
    };

    fetchLifeOSStatus();
    
    // Refresh status every 30 seconds for live updates
    const interval = setInterval(fetchLifeOSStatus, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  const handleCrisisClick = (modeId: string) => {
    setSelectedMode(modeId);
    setPlan(null);
  };

  const generatePlan = async (data?: any) => {
    if (!selectedMode) return;
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 1500));

      const mockPlans: Record<string, string[]> = {
        money: ["ตรวจสอบยอดเงินคงเหลือในบัญชีหลัก", "โอนเงินเข้าเซฟบ็อกซ์ฉุกเฉิน (Vault)", "งดใช้จ่ายบัตรเครดิตวันนี้"],
        work: ["กรองและมอบหมายงานด่วนที่สุด", "โฟกัสแค่ 1 งานหลักก่อนเที่ยงนี้", "เลื่อนประชุมที่ไม่จำเป็นในช่วงบ่าย"],
        burnout: ["หยุดสายตากับหน้าจอคอม 15 นาที", "ดื่มน้ำเย็นเพิ่มความสดชื่น 1 แก้วใหญ่", "งีบหลับสั้นๆ 20 นาที (Power Nap)"],
        urgent: ["ติดต่อผู้เกี่ยวข้องด่วนที่สุดเพื่อประสานงาน", "ยกเลิกนัดหมายอื่นๆ วันนี้ทั้งหมด", "บันทึกสรุปสถานการณ์สั้นๆ"]
      };

      setPlan(mockPlans[selectedMode] || ["ตั้งสติประเมินสถานการณ์", "เริ่มแยกแยะปัญหาเป็นส่วนๆ", "ลงมือทำตามคำแนะนำแรก"]);
    } catch (e) {
      console.error(e);
      setPlan(["ระบบ AI ขัดข้องชั่วคราว โปรดตัดสินใจตามสมควร"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col relative overflow-hidden text-foreground font-sans bg-background">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 border-b border-border pb-5">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-2"
          >
            พร้อมเสมอครับ คุณ{user}
          </motion.h1>
          <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online • Active Terminal
          </div>
        </div>
        <Link 
          href="/settings" 
          className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary transition-all cursor-pointer"
        >
          <User className="text-muted-foreground w-6 h-6 hover:text-foreground" />
        </Link>
      </header>

      {/* Main Grid: Redesigned into 3 Columns */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full">
        
        {/* Left Column: Eisenhower Matrix (Tasks) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border p-6 rounded-2xl shadow-sm h-[520px] flex flex-col hover:border-primary/20 transition-all duration-300"
        >
          <EisenhowerMatrix />
        </motion.div>

        {/* Center Column: Cybernetic Reactor Core & Live Score (Prominent) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-between h-[520px] hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
          
          <div className="w-full text-center relative z-10">
            <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase font-mono bg-secondary border border-border px-2 py-0.5 rounded">Core Reactor</span>
            <h3 className="text-md font-bold text-foreground mt-3 uppercase tracking-wider font-mono">ระบบแกนกลางชีวิต (Core OS)</h3>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-44 relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center">
            {mounted ? (
              <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <CyberneticReactor soul={lifeScores.soul} state={lifeScores.state} />
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
              </Canvas>
            ) : (
              <div className="w-16 h-16 border-2 border-t-transparent border-primary rounded-full animate-spin" />
            )}
          </div>

          {/* Status and Action */}
          <div className="text-center w-full relative z-10 px-4">
            <h2 className={`text-3xl font-black font-mono tracking-tighter mb-1 uppercase ${
              lifeScores.state === 'SUPER NEON' ? 'text-cyan-600' :
              lifeScores.state === 'CRISIS' ? 'text-red-600' :
              lifeScores.state === 'LOW BATTERY' ? 'text-pink-600' :
              'text-green-600'
            }`}>
              {lifeScores.state}
            </h2>
            <p className="text-xs text-muted-foreground font-medium line-clamp-2 italic">
              "{lifeScores.recommendedAction}"
            </p>
          </div>

          {/* Core Stats Progress Bars */}
          <div className="w-full space-y-2.5 mt-2 relative z-10 bg-muted/50 p-4 border border-border rounded-xl">
            {/* Wealth (Cyan) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">
                <span>Wealth (การเงิน)</span>
                <span className="text-cyan-600">{lifeScores.wealth}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${lifeScores.wealth}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                />
              </div>
            </div>

            {/* Power (Pink) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">
                <span>Power (การงาน)</span>
                <span className="text-pink-600">{lifeScores.power}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${lifeScores.power}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500" 
                />
              </div>
            </div>

            {/* Soul (Green) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">
                <span>Soul (จิตวิญญาณ)</span>
                <span className="text-green-600">{lifeScores.soul}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${lifeScores.soul}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Health (Habits) & Crisis Mode */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 h-[520px] justify-between"
        >
          {/* Habits Panel */}
          <div className="bg-card border border-border p-5 rounded-2xl flex-1 hover:border-zinc-300 transition-all duration-300 overflow-y-auto">
            <HabitTracker />
          </div>

          {/* Crisis Console Panel */}
          <div className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 transition-all duration-300 shrink-0">
            <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2 tracking-wider font-mono uppercase">
              <AlertTriangle className="w-5 h-5" />
              โหมดวิกฤต (Crisis Console)
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {CRISIS_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleCrisisClick(mode.id)}
                  className={`
                    group p-3 rounded-xl border border-border bg-muted/40 flex flex-col justify-between text-left transition-all h-20 cursor-pointer
                    hover:border-red-400 hover:bg-secondary
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-mono text-red-600 tracking-widest uppercase font-bold">EMERGENCY</span>
                    <mode.icon className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">{mode.label}</h4>
                    <p className="text-muted-foreground text-[9px] truncate max-w-full mt-0.5">{mode.question}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Chatbot Floating Widget */}
      <NeonChatWidget />

      {/* Crisis Dialog Component */}
      <CrisisDialog
        mode={selectedMode}
        isOpen={!!selectedMode}
        onClose={() => setSelectedMode(null)}
        onConfirm={(data) => {
          generatePlan(data);
        }}
      />

      {/* Result Display (AI Action Plan) */}
      <AnimatePresence>
        {plan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm pointer-events-auto" onClick={() => setPlan(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-lg overflow-hidden pointer-events-auto"
            >
              <button
                onClick={() => setPlan(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-red-600 mb-5 flex items-center gap-3 font-mono">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                  แผนแก้ปัญหา: คุณ{user}
                </h3>
                <div className="space-y-3 mb-6">
                  {plan.map((step, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/55 border border-border"
                    >
                      <div className="w-7 h-7 rounded-full bg-secondary border border-red-500/50 flex items-center justify-center text-xs font-bold text-red-600 shadow-sm shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
                <Button
                  onClick={() => setPlan(null)}
                  className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  รับทราบแผนงาน / ดำเนินการ
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
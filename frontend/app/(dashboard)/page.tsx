"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Briefcase, X, ChevronRight, User, Wallet } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { CrisisDialog } from "@/components/dashboard/CrisisDialog";
import { EisenhowerMatrix } from "@/components/work/EisenhowerMatrix";
import { HabitTracker } from "@/components/health/HabitTracker";
import { NeonChatWidget } from "@/components/dashboard/NeonChatWidget";

// Crisis Categories (Thai)
const CRISIS_MODES = [
  { id: 'money', label: 'สภาพคล่องตึงตัว', icon: Wallet, color: 'emerald', question: "เงินสดไม่พอ / หมุนเงินไม่ทัน?", sub: "วิเคราะห์ & แก้ไข" },
  { id: 'work', label: 'งานล้นมือ', icon: Briefcase, color: 'blue', question: "งานเยอะทำไม่ทัน?", sub: "จัดลำดับความสำคัญ" },
  { id: 'burnout', label: 'หมดไฟ / เครียด', icon: Zap, color: 'orange', question: "เหนื่อย หมดแรงบันดาลใจ?", sub: "เติมพลัง" },
  { id: 'urgent', label: 'เรื่องด่วน', icon: AlertTriangle, color: 'rose', question: "เรื่องฉุกเฉิน / ครอบครัว?", sub: "แผนรับมือ" },
];

export default function CommandPage() {
  const t = useTranslations('Dashboard');
  const [user, setUser] = useState("นายท่าน");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string[] | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUser(storedName);
    }
  }, []);

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
        money: ["ตรวจสอบยอดเงินคงเหลือในบัญชี SCB (ลงท้าย 8899)", "โอนเงิน 5,000 บาท เข้า 'Vault ฉุกเฉิน'", "งดการใช้จ่ายฟุ่มเฟือยวันนี้ ทานข้าวบ้าน"],
        work: ["มอบหมายงาน 'Report' ให้ทีมช่วยทำ", "โฟกัสแค่ 'Client Presentation' บ่ายนี้", "ยกเลิกนัดที่ไม่สำคัญตอน 4 โมงเย็น"],
        burnout: ["หยุดทำงานทันที 15 นาที", "ดื่มน้ำ 1 แก้วใหญ่", "งีบหลับ 20 นาที (Power Nap)"],
        urgent: ["โทรหาคุณแม่ทันที", "เรียกรถไปโรงพยาบาลถ้าจำเป็น", "ยกเลิกนัดเย็นนี้ทั้งหมด"]
      };

      setPlan(mockPlans[selectedMode] || ["ตั้งสติ", "ประเมินสถานการณ์", "เริ่มลงมือทำ"]);
    } catch (e) {
      console.error(e);
      setPlan(["ระบบขัดข้อง โปรดตรวจสอบด้วยตนเอง"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2"
          >
            พร้อมเสมอครับ คุณ{user}
          </motion.h1>
          <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            System Online
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <User className="text-zinc-500 w-6 h-6" />
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full">
        {/* Left Column: Tracking */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="w-full h-[400px]">
            <EisenhowerMatrix />
          </div>
        </div>

        {/* Right Column: Health & Crisis */}
        <div className="flex flex-col gap-6">
          <HabitTracker />

          <div className="bg-zinc-900/40 border border-red-900/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] pointer-events-none rounded-full" />
            <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              โหมดฉุกเฉิน (Crisis)
            </h3>
            <div className="flex flex-col gap-3">
              {CRISIS_MODES.map((mode, index) => (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCrisisClick(mode.id)}
                  className={`
                            group p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center gap-4 transition-all
                            hover:border-${mode.color}-900/50 hover:shadow-lg hover:shadow-${mode.color}-900/10 text-left
                        `}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-${mode.color}-500/10 text-${mode.color}-500 group-hover:bg-${mode.color}-500 group-hover:text-white transition-colors`}>
                    <mode.icon className="w-5 h-5 cursor-pointer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{mode.label}</h4>
                    <p className="text-zinc-500 text-[10px] truncate max-w-[120px]">{mode.question}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setPlan(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-zinc-200 rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-hidden pointer-events-auto"
            >
              <button
                onClick={() => setPlan(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="pt-2">
                <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  แผนรับมือ: {user}
                </h3>
                <div className="space-y-4 mb-8">
                  {plan.map((step, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                      key={i}
                      className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-zinc-900 shadow-sm shrink-0 border border-zinc-200">
                        {i + 1}
                      </div>
                      <p className="text-zinc-700 font-medium text-lg leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
                <Button
                  onClick={() => setPlan(null)}
                  className="w-full h-14 text-lg font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
                >
                  รับทราบ / ดำเนินการ
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 
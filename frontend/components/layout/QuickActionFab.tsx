import { useState, useEffect, useRef } from "react";
import { Wallet, CheckSquare, Heart, PenTool, Banknote, FileText, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { FinanceModal } from "@/components/modals/FinanceModal";
import { WorkModal } from "@/components/modals/WorkModal";
import { SoulModal } from "@/components/modals/SoulModal";

export function QuickActionFab() {
    const t = useTranslations('FAB'); // Assuming 'FAB' namespace exists, or fallback
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Modal States
    const [showFinanceModal, setShowFinanceModal] = useState(false);
    const [financeType, setFinanceType] = useState<"income" | "expense">("expense");
    const [showWorkModal, setShowWorkModal] = useState(false);
    const [showSoulModal, setShowSoulModal] = useState(false);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Listen for Sidebar "Open Quick Action" event
    useEffect(() => {
        const handleOpen = () => setOpen(true);
        window.addEventListener('open-quick-action', handleOpen);
        return () => window.removeEventListener('open-quick-action', handleOpen);
    }, []);

    const menuItems = [
        { icon: Banknote, label: "จดรายจ่าย", color: "bg-red-500", action: () => { setShowFinanceModal(true); setFinanceType("expense"); } },
        { icon: FileText, label: "เพิ่มงาน", color: "bg-blue-500", action: () => setShowWorkModal(true) },
        { icon: Heart, label: "บันทึกอารมณ์", color: "bg-pink-500", action: () => setShowSoulModal(true) },
    ];

    return (
        <>
            <FinanceModal
                isOpen={showFinanceModal}
                onClose={() => setShowFinanceModal(false)}
                defaultType={financeType}
            />
            <WorkModal
                isOpen={showWorkModal}
                onClose={() => setShowWorkModal(false)}
            />
            <SoulModal
                isOpen={showSoulModal}
                onClose={() => setShowSoulModal(false)}
            />

            <div className="fixed top-0 left-72 z-50 pointer-events-none" ref={containerRef}>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute top-20 left-6 flex flex-col gap-3 pointer-events-auto min-w-[200px]"
                        >
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => {
                                        item.action();
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/95 border border-zinc-800 backdrop-blur-md shadow-2xl hover:bg-zinc-800 transition-colors group text-left"
                                >
                                    <div className={`p-2 rounded-lg ${item.color} text-white shadow-lg`}>
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-zinc-200 group-hover:text-white">
                                        {item.label}
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

"use client";
import { useState } from "react";
import { Plus, Wallet, CheckSquare, Heart, Settings, X, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FinanceModal } from "./modals/FinanceModal";
import { WorkModal } from "./modals/WorkModal";
import { SoulModal } from "./modals/SoulModal";

export function GlobalFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFinanceOpen, setIsFinanceOpen] = useState(false);
    const [isWorkOpen, setIsWorkOpen] = useState(false);
    const [isSoulOpen, setIsSoulOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const actions = [
        {
            label: "บันทึกความรู้สึก (Journal)",
            icon: Edit3,
            color: "bg-pink-600",
            onClick: () => setIsSoulOpen(true)
        },
        {
            label: "เพิ่มงานใหม่ (Task)",
            icon: CheckSquare,
            color: "bg-violet-600",
            onClick: () => setIsWorkOpen(true)
        },
        {
            label: "ลงบัญชีรายวัน (Finance)",
            icon: Wallet,
            color: "bg-emerald-600",
            onClick: () => setIsFinanceOpen(true)
        },
    ];

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <div className="flex flex-col items-end gap-3 mb-2">
                            {actions.map((action, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    className="flex items-center gap-3 group"
                                >
                                    <motion.span
                                        className="bg-black/80 backdrop-blur border border-zinc-800 px-3 py-1.5 rounded-lg text-sm text-zinc-300 shadow-xl"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        {action.label}
                                    </motion.span>
                                    <Button
                                        size="icon"
                                        className={`${action.color} text-white rounded-full h-12 w-12 shadow-lg hover:brightness-110 transition-all`}
                                        onClick={() => {
                                            action.onClick();
                                            setIsOpen(false);
                                        }}
                                    >
                                        <action.icon className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <Button
                        onClick={toggleMenu}
                        className={`h-16 w-16 rounded-full shadow-2xl shadow-blue-500/20 transition-all duration-300 ${isOpen
                            ? "bg-zinc-800 hover:bg-zinc-700"
                            : "bg-blue-600 hover:bg-blue-500 hover:scale-105"
                            }`}
                    >
                        <Plus className="h-8 w-8 text-white" />
                    </Button>
                </motion.div>
            </div>

            <FinanceModal isOpen={isFinanceOpen} onClose={() => setIsFinanceOpen(false)} />
            <WorkModal isOpen={isWorkOpen} onClose={() => setIsWorkOpen(false)} />
            <SoulModal isOpen={isSoulOpen} onClose={() => setIsSoulOpen(false)} />
        </>
    );
}

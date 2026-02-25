"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export function BudgetProgressBar() {
    const [spent, setSpent] = useState(0);
    const [limit, setLimit] = useState(30000); // Default placeholder
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                // Determine monthly spending
                const res = await axios.get("http://localhost:3005/api/finance/transactions", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const now = new Date();
                const thisMonth = res.data.filter((t: any) => {
                    const d = new Date(t.date);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'EXPENSE';
                });

                const totalSpent = thisMonth.reduce((acc: number, t: any) => acc + t.amount, 0);
                setSpent(totalSpent);

                // Fetch real budget limit via API if available (mock for now because endpoint returns list, complex logic to pick one)
                // For MVP, we fix at 30,000 or let user set it later.
            } catch (error) {
                console.error("Budget fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const percentage = Math.min((spent / limit) * 100, 100);
    let color = "bg-emerald-500";
    if (percentage > 50) color = "bg-yellow-500";
    if (percentage > 80) color = "bg-rose-500";

    return (
        <div className="p-6 rounded-xl border border-yellow-500/30 bg-zinc-950/90 shadow-lg shadow-yellow-500/10">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="text-lg font-bold text-white">งบประมาณเดือนนี้ (Monthly Budget)</h3>
                    <p className="text-xs text-zinc-500">ใช้ไปแล้ว ฿{spent.toLocaleString()} จาก ฿{limit.toLocaleString()}</p>
                </div>
                <div className={`text-xl font-black ${percentage > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {percentage.toFixed(1)}%
                </div>
            </div>

            <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                {/* Glow behind */}
                <div className={`absolute top-0 left-0 h-full w-full opacity-20 blur-md transition-all duration-1000 ${color}`} style={{ width: `${percentage}%` }}></div>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${color} shadow-[0_0_15px_rgba(234,179,8,0.5)] relative`}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 h-full skew-x-12 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </motion.div>
            </div>

            {percentage > 90 && (
                <p className="text-xs text-rose-400 mt-2 font-bold animate-pulse">⚠️ ระวัง! ใรเกินงบแล้ว (Warning: Over Budget)</p>
            )}
        </div>
    );
}

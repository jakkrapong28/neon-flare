"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Search, Filter, Trash2, ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { TransactionModal } from "@/components/finance/TransactionModal";

export default function TransactionsPage() {
    const { data, mounted, deleteTransaction } = useFinanceSystem();
    const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    const [search, setSearch] = useState("");

    const handleDelete = (id: string) => {
        if (confirm("ยืนยันการลบรายการนี้?")) {
            deleteTransaction(id);
        }
    };

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading...</div>;

    const filtered = data.transactions.filter(t => {
        const matchesFilter = filter === 'ALL' || t.type === filter;
        const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
            t.note?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-white">ประวัติธุรกรรม (History)</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        <input
                            placeholder="ค้นหา..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white outline-none focus:border-amber-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl w-fit border border-zinc-800">
                {(['ALL', 'INCOME', 'EXPENSE'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {f === 'ALL' ? 'ทั้งหมด' : f === 'INCOME' ? 'รายรับ' : 'รายจ่าย'}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length > 0 ? filtered.map((t) => (
                    <div key={t.id} className="group flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {t.type === 'INCOME' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{t.category}</h3>
                                <p className="text-xs text-zinc-500">
                                    {new Date(t.date).toLocaleString('th-TH', {
                                        timeZone: 'Asia/Bangkok',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    {t.note && ` • ${t.note}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className={`text-xl font-mono font-bold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {t.type === 'INCOME' ? '+' : '-'} ฿{t.amount.toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center text-zinc-500 italic border-2 border-dashed border-zinc-900 rounded-2xl">
                        ไม่พบข้อมูลธุรกรรม
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TransactionModalProps {
    onSuccess?: () => void;
}

export function TransactionModal({ onSuccess }: TransactionModalProps) {
    const { addTransaction } = useFinanceSystem();
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;

        // Append time if date is today to avoid "00:00:00"
        let finalDate = formData.date;
        // interactive date picker uses local time yyyy-mm-dd
        // new Date().toLocaleDateString('en-CA') returns YYYY-MM-DD in local time zone
        const todayStr = new Date().toLocaleDateString('en-CA');

        if (formData.date === todayStr) {
            // It's today, so we want the specific current time
            finalDate = new Date().toISOString();
        } else {
            // For past dates, ideally we might want to keep it as is (midnight) or append 12:00?
            // Leaving as YYYY-MM-DD string might be cast to midnight UTC by backend.
            // If we want consistency, we can append T00:00:00 or T12:00:00. 
            // But backend handles date strings fine.
        }

        addTransaction({
            type,
            amount: parseFloat(formData.amount),
            category: formData.category,
            note: formData.note,
            date: finalDate
        });

        setOpen(false);
        setFormData({
            amount: '',
            category: '',
            note: '',
            date: new Date().toISOString().split('T')[0]
        });
        if (onSuccess) onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20">
                    <Plus className="w-5 h-5" />
                    เพิ่มรายการ
                </button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มรายการใหม่ (Add Transaction)</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 mb-4 bg-zinc-900 p-1 rounded-lg">
                    <button
                        onClick={() => setType('INCOME')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${type === 'INCOME' ? 'bg-emerald-500 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
                    >
                        รายรับ (Income)
                    </button>
                    <button
                        onClick={() => setType('EXPENSE')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${type === 'EXPENSE' ? 'bg-rose-500 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
                    >
                        รายจ่าย (Expense)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-400">จำนวนเงิน (Amount)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none text-xl font-mono"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400">หมวดหมู่ (Category)</label>
                        <input
                            required
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                            placeholder="Food, Travel, Salary..."
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400">วันที่ (Date)</label>
                        <input
                            required
                            type="date"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-zinc-400">บันทึกช่วยจำ (Note)</label>
                        <input
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                            placeholder="Optional..."
                            value={formData.note}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-12 rounded-xl mt-2">
                        บันทึกรายการ
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

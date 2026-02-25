"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Plus, Trash2, AlertCircle, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SubscriptionPage() {
    const { data, mounted, addBill, deleteBill } = useFinanceSystem();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        date: ''
    });

    // 1. Filter only SUBSCRIPTION types from the unified bills array
    const subscriptions = data.bills.filter(b => b.type === 'SUBSCRIPTION');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add as a Bill with type SUBSCRIPTIO
        addBill({
            name: formData.name,
            amount: parseFloat(formData.amount),
            dueDate: parseInt(formData.date),
            type: 'SUBSCRIPTION'
        });
        setIsModalOpen(false);
        setFormData({ name: '', amount: '', date: '' });
    };

    const handleDelete = (id: string) => {
        if (confirm("ยกเลิกการติดตามรายการนี้?")) {
            deleteBill(id);
        }
    };

    const getDaysLeft = (day: number) => {
        const today = new Date().getDate();
        if (day >= today) return day - today;
        return (30 - today) + day; // Approx next month
    };

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading Subscriptions...</div>;

    const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <CreditCard className="w-8 h-8 text-pink-500" />
                        จัดการรายเดือน (Subscriptions)
                    </h1>
                    <p className="text-zinc-400">ควบคุมค่าใช้จ่ายรายเดือนและบริการต่างๆ</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">ค่าใช้จ่ายเฉลี่ยต่อเดือน</p>
                    <p className="text-2xl font-black text-white">฿{totalMonthly.toLocaleString()}</p>
                </div>
            </div>

            {/* Add Button */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700">
                        <Plus className="w-5 h-5 text-emerald-400" />
                        เริ่มติดตามบริการใหม่ +
                    </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>เพิ่มรายการใหม่ (Add Subscription)</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <label className="text-sm text-zinc-400">ชื่อบริการ (Service Name)</label>
                            <input
                                required
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                                placeholder="Netflix, Spotify, Gym..."
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-zinc-400">ราคา (Price)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-400">จ่ายทุกวันที่ (Day of Month)</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    max="31"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                                    placeholder="1-31"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 rounded-xl">
                            บันทึกรายการ
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map((sub) => {
                    const daysLeft = getDaysLeft(sub.dueDate);
                    const isUrgent = daysLeft <= 3;

                    return (
                        <div key={sub.id} className={`relative p-6 bg-zinc-900/40 rounded-2xl border transition-all hover:-translate-y-1 ${isUrgent ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-2xl font-black text-zinc-700 border border-zinc-800">
                                    {sub.name[0].toUpperCase()}
                                </div>
                                <button onClick={() => handleDelete(sub.id)} className="text-zinc-600 hover:text-rose-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{sub.name}</h3>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-mono text-emerald-400">฿{sub.amount}</span>
                                <div className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${isUrgent ? 'bg-rose-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                                    {isUrgent && <AlertCircle className="w-3 h-3" />}
                                    {daysLeft === 0 ? 'วันนี้!' : `อีก ${daysLeft} วัน`}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {subscriptions.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl opacity-50">
                        <p className="text-zinc-500">ยังไม่มีรายการสมัครสมาชิก</p>
                    </div>
                )}
            </div>

        </div>
    )
}

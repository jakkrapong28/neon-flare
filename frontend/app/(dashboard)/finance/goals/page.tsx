"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, Trophy, PiggyBank, ArrowRight, Plus, Trash2 } from "lucide-react";

export default function GoalsPage() {
    const { data, mounted, addGoal, depositToGoal, deleteGoal } = useFinanceSystem();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

    const [newGoal, setNewGoal] = useState({ name: '', target: '' });
    const [amount, setAmount] = useState('');

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading Goals...</div>;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addGoal({ name: newGoal.name, targetAmount: parseFloat(newGoal.target) });
        setIsAddOpen(false);
        setNewGoal({ name: '', target: '' });
    };

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGoal && amount) {
            depositToGoal(selectedGoal, parseFloat(amount));
            setIsDepositOpen(false);
            setAmount('');
            setSelectedGoal(null);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Target className="w-8 h-8 text-blue-500" />
                        เป้าหมายเงินออม (Savings Goals)
                    </h1>
                    <p className="text-zinc-400">ตั้งเป้าหมายและสะสมเงินเพื่อความฝันของคุณ</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                            <Plus className="w-5 h-5" /> ตั้งเป้าหมายใหม่
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader><DialogTitle>สร้างเป้าหมายใหม่</DialogTitle></DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input required placeholder="ชื่อเป้าหมาย (e.g. ซื้อรถ, เที่ยวญี่ปุ่น)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })} />
                            <input required type="number" placeholder="จำนวนเงินเป้าหมาย (Target)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} />
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold">เริ่มเก็บออม</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.goals.map(goal => {
                    const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                    const isCompleted = percent >= 100;

                    return (
                        <div key={goal.id} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                            {isCompleted && (
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trophy className="w-24 h-24 text-yellow-500" />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                                    <PiggyBank className={`w-6 h-6 ${isCompleted ? 'text-yellow-500' : 'text-blue-500'}`} />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500">เป้าหมาย</p>
                                    <p className="font-bold text-white">฿{goal.targetAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{goal.name}</h3>
                            <div className="flex items-end gap-2 mb-6 relative z-10">
                                <span className={`text-3xl font-black ${isCompleted ? 'text-yellow-500' : 'text-blue-400'}`}>฿{goal.currentAmount.toLocaleString()}</span>
                                <span className="text-sm font-bold text-zinc-500 mb-1">({percent.toFixed(1)}%)</span>
                            </div>

                            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mb-6 relative z-10">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            <Dialog open={isDepositOpen && selectedGoal === goal.id} onOpenChange={(open) => {
                                if (!open) setSelectedGoal(null);
                                setIsDepositOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <button
                                        onClick={() => { setSelectedGoal(goal.id); setIsDepositOpen(true); }}
                                        disabled={isCompleted}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all relative z-10 ${isCompleted ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-zinc-800 text-white hover:bg-blue-600'}`}
                                    >
                                        {isCompleted ? 'เป้าหมายสำเร็จ! 🎉' : <> <ArrowRight className="w-4 h-4" /> ฝากเงินเพิ่ม (Deposit) </>}
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                                    <DialogHeader><DialogTitle>ฝากเงินเข้า: {goal.name}</DialogTitle></DialogHeader>
                                    <form onSubmit={handleDeposit} className="space-y-4">
                                        <p className="text-sm text-zinc-400">เงินจะถูกตัดจากยอดคงเหลือ (Balance) ของคุณ</p>
                                        <input required type="number" autoFocus placeholder="จำนวนเงินฝาก" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white text-xl font-mono" value={amount} onChange={e => setAmount(e.target.value)} />
                                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold h-12">ยืนยันการฝาก</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <button onClick={() => confirm("ลบเป้าหมายนี้?") && deleteGoal(goal.id)} className="absolute bottom-6 right-6 p-2 text-zinc-600 hover:text-red-500 transition-colors z-20">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    );
                })}

                {data.goals.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl opacity-50">
                        <p className="text-zinc-500">ยังไม่มีเป้าหมาย... เริ่มฝันได้เลย!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

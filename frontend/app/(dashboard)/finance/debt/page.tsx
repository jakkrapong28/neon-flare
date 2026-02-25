"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2, TrendingDown, Calendar, AlertCircle, Coins } from "lucide-react";

export default function DebtPage() {
    const { data, mounted, addDebt, payDebt, deleteDebt } = useFinanceSystem();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<string | null>(null);

    // Add Debt Form
    const [addForm, setAddForm] = useState({ name: '', amount: '', months: '', interest: '', due: '', monthlyInstallment: '' });
    // Pay Debt Form
    const [payAmount, setPayAmount] = useState('');

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading Debts...</div>;

    const totalDebt = data.debts.reduce((acc, d) => acc + d.remainingAmount, 0);

    const handleAddDebt = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(addForm.amount);
        const months = parseInt(addForm.months);
        const installment = addForm.monthlyInstallment ? parseFloat(addForm.monthlyInstallment) : (amount / months);

        addDebt({
            name: addForm.name,
            amount: amount,
            remainingAmount: amount,
            totalMonths: months,
            interestRate: parseFloat(addForm.interest),
            dueDate: parseInt(addForm.due),
            minPayment: installment,
            monthlyInstallment: installment
        });
        setIsAddModalOpen(false);
        setAddForm({ name: '', amount: '', months: '', interest: '', due: '', monthlyInstallment: '' });
    };

    const handlePayDebt = (id: string, installment: number) => {
        payDebt(id, installment);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <TrendingDown className="w-8 h-8 text-rose-500" />
                        ปลดหนี้ (Debt Management)
                    </h1>
                    <p className="text-zinc-400">ระบบคำนวณผ่อนชำระและจัดการหนี้สิน</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">หนี้คงเหลือทั้งหมด</p>
                    <p className="text-2xl font-black text-rose-500">฿{totalDebt.toLocaleString()}</p>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add New Card */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <div className="min-h-[290px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-500/50 hover:bg-zinc-900/50 transition-all group">
                            <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                                <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white" />
                            </div>
                            <p className="mt-4 text-zinc-500 font-bold group-hover:text-white">เพิ่มรายการหนี้</p>
                            <span className="text-xs text-zinc-600 mt-1">Calculated Installments</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader><DialogTitle>เพิ่มหนี้ก้อนใหม่ (Create Loan)</DialogTitle></DialogHeader>
                        <form onSubmit={handleAddDebt} className="space-y-4">
                            <input required placeholder="ชื่อรายการ (e.g. กู้ซื้อบ้าน, บัตรเครดิต)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" placeholder="ยอดหนี้ทั้งหมด (Total)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={addForm.amount} onChange={e => setAddForm({ ...addForm, amount: e.target.value })} />
                                <input required type="number" placeholder="จำนวนงวด (เดือน)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={addForm.months} onChange={e => setAddForm({ ...addForm, months: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" placeholder="ดอกเบี้ย % ต่อปี" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={addForm.interest} onChange={e => setAddForm({ ...addForm, interest: e.target.value })} />
                                <input required type="number" placeholder="วันที่ต้องจ่าย (1-31)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={addForm.due} onChange={e => setAddForm({ ...addForm, due: e.target.value })} />
                            </div>
                            <input type="number" placeholder="ระบุยอดผ่อน/เดือน (ถ้ามี)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={addForm.monthlyInstallment} onChange={e => setAddForm({ ...addForm, monthlyInstallment: e.target.value })} />

                            {addForm.amount && addForm.months && (
                                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-sm">
                                    <span className="text-zinc-500">ค่างวดโดยประมาณ:</span>
                                    <span className="float-right font-bold text-rose-400">
                                        ฿{addForm.monthlyInstallment ? parseFloat(addForm.monthlyInstallment).toLocaleString() : (parseFloat(addForm.amount) / parseFloat(addForm.months)).toLocaleString()}/เดือน
                                    </span>
                                </div>
                            )}
                            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 font-bold">บันทึก</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Info Cards */}
                {data.debts.map(debt => {
                    const installment = debt.monthlyInstallment || (debt.amount / (debt.totalMonths || 1));
                    return (
                        <div key={debt.id} className="relative bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden group hover:border-rose-500/30 transition-all">
                            <button
                                onClick={() => deleteDebt(debt.id)}
                                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                                    <Coins className="w-6 h-6 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{debt.name}</h3>
                                    <p className="text-zinc-400 text-sm">Due on day {debt.dueDate}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-1">Remaining</p>
                                        <p className="text-2xl font-black text-rose-500">฿ {debt.remainingAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500 mb-1">Total</p>
                                        <p className="text-lg font-bold text-white">฿ {debt.amount.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-600 to-orange-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${((debt.amount - debt.remainingAmount) / debt.amount) * 100}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>งวดที่ {debt.paidMonths}/{debt.totalMonths}</span>
                                    <span>ผ่อน ฿{installment.toLocaleString(undefined, { maximumFractionDigits: 0 })}/ด.</span>
                                </div>

                                <Button onClick={() => handlePayDebt(debt.id, installment)} className="w-full bg-zinc-800 hover:bg-emerald-600 hover:text-white font-bold transition-all">
                                    ชำระงวดนี้ (Pay Month {debt.paidMonths + 1})
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

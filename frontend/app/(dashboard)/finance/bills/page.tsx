"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Receipt, Plus, CheckCircle2, Clock, Trash2 } from "lucide-react";

export default function BillsPage() {
    const { data, mounted, addBill, markBillPaid, deleteBill } = useFinanceSystem();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', amount: '', due: '' });

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading Bills...</div>;

    const bills = data.bills.filter(b => b.type === 'BILL');
    const today = new Date().getDate();

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addBill({
            name: newItem.name,
            amount: parseFloat(newItem.amount),
            dueDate: parseInt(newItem.due),
            type: 'BILL'
        });
        setIsAddOpen(false);
        setNewItem({ name: '', amount: '', due: '' });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Receipt className="w-8 h-8 text-amber-500" />
                        แจ้งเตือนค่าใช้จ่าย (Bills & Payments)
                    </h1>
                    <p className="text-zinc-400">จัดการค่าใช้จ่ายประจำเดือนและกำหนดชำระ</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20">
                            <Plus className="w-5 h-5" /> เพิ่มบิล
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader><DialogTitle>เพิ่มบิลใหม่</DialogTitle></DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input required placeholder="รายการ (e.g. ค่าไฟ, ค่าเน็ต)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            <input required type="number" placeholder="จำนวนเงิน (โดยประมาณ)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={newItem.amount} onChange={e => setNewItem({ ...newItem, amount: e.target.value })} />
                            <input required type="number" placeholder="วันที่ต้องจ่าย (1-31)" max="31" min="1" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={newItem.due} onChange={e => setNewItem({ ...newItem, due: e.target.value })} />
                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 font-bold">บันทึก</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bills.map(bill => {
                    const isDueSoon = !bill.isPaid && bill.dueDate >= today && bill.dueDate <= today + 3;
                    const isOverdue = !bill.isPaid && bill.dueDate < today;

                    return (
                        <div key={bill.id} className={`p-6 rounded-2xl border transition-all relative overflow-hidden group ${isOverdue ? 'bg-rose-950/20 border-rose-900/50' : bill.isPaid ? 'bg-zinc-900/30 border-zinc-800 opacity-60' : 'bg-zinc-900/50 border-zinc-700'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${bill.isPaid ? 'bg-emerald-900/30 text-emerald-500' : 'bg-zinc-800 text-white'}`}>
                                    {bill.dueDate}
                                </div>
                                {!bill.isPaid && (
                                    <button
                                        onClick={() => {
                                            if (confirm(`ยืนยันการจ่ายบิล ${bill.name}? ระบบจะบันทึกเป็นรายจ่ายทันที`)) {
                                                markBillPaid(bill.id);
                                            }
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle2 className="w-3 h-3" /> Mark Paid
                                    </button>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{bill.name}</h3>
                            <p className="text-2xl font-black text-amber-500">฿{bill.amount.toLocaleString()}</p>

                            {isDueSoon && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-black text-[10px] font-bold rounded-bl-xl">
                                    ใกล้ถึงกำหนด!
                                </div>
                            )}
                            {isOverdue && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-bl-xl">
                                    เกินกำหนด (Overdue)
                                </div>
                            )}
                            {bill.isPaid && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-bl-xl">
                                    จ่ายแล้ว (Paid)
                                </div>
                            )}

                            <button onClick={() => deleteBill(bill.id)} className="absolute bottom-4 right-4 text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
                {bills.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                        <p className="text-zinc-500">ไม่มีรายการบิล (สบายใจได้!)</p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Pill, Plus, Check, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MedsPage() {
    const { data, addMed, toggleMed, deleteMed } = useHealthSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: '', dosage: '', time: 'Morning' as const });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addMed({ ...form, taken: false });
        setIsOpen(false);
        setForm({ name: '', dosage: '', time: 'Morning' });
    };

    const sections = ['Morning', 'Noon', 'Evening', 'Bedtime'];

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <Pill className="w-8 h-8 text-rose-400" />
                    ยาและอาหารเสริม (Meds)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-500 rounded-full px-6">
                            <Plus className="w-5 h-5 mr-1" /> Add Med
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>เพิ่มรายการยา (Add Medication)</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <div>
                                <label className="text-sm text-zinc-400">ชื่อยา (Name)</label>
                                <input required className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Vitamin C" />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-400">ขนาด/จำนวน (Dosage)</label>
                                <input required className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} placeholder="1 Tablet" />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-400">เวลาที่ทาน (Time)</label>
                                <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.time} onChange={e => setForm({ ...form, time: e.target.value as any })}>
                                    <option>Morning</option>
                                    <option>Noon</option>
                                    <option>Evening</option>
                                    <option>Bedtime</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full bg-rose-600 font-bold">บันทึก</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-8">
                {sections.map(section => {
                    const meds = data.meds.filter(m => m.time === section);
                    if (meds.length === 0) return null;

                    return (
                        <div key={section} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-zinc-500" /> {section}
                            </h3>
                            <div className="space-y-3">
                                {meds.map(med => (
                                    <div key={med.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${med.taken ? 'bg-emerald-900/20 border-emerald-900/50 opacity-60' : 'bg-black/40 border-zinc-800'}`}>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => toggleMed(med.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${med.taken ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 hover:border-emerald-500'}`}>
                                                {med.taken && <Check className="w-5 h-5 text-white" />}
                                            </button>
                                            <div>
                                                <p className={`font-bold ${med.taken ? 'text-zinc-500 line-through' : 'text-white'}`}>{med.name}</p>
                                                <p className="text-xs text-zinc-500">{med.dosage}</p>
                                            </div>
                                        </div>

                                        <button onClick={() => deleteMed(med.id)} className="text-zinc-700 hover:text-red-500">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {data.meds.length === 0 && <div className="text-center py-20 text-zinc-500">ยังไม่มีรายการยา</div>}
            </div>
        </div>
    );
}

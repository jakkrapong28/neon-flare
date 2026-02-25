"use client";

import { useHealthSystem, Medication } from "@/hooks/useHealthSystem";
import { Pill, Plus, Check, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MedicationPage() {
    const { data, addMed, toggleMed, deleteMed } = useHealthSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<Partial<Medication>>({ name: '', dosage: '', time: 'Morning', taken: false });

    const handleAdd = () => {
        if (form.name) {
            addMed({
                name: form.name,
                dosage: form.dosage || '1 pill',
                time: form.time as any || 'Morning',
                taken: false
            });
            setIsOpen(false);
            setForm({ name: '', dosage: '', time: 'Morning', taken: false });
        }
    };

    const categories = ["Morning", "Noon", "Evening", "Bedtime"];
    const categoryLabels: Record<string, string> = {
        "Morning": "เช้า (Morning)",
        "Noon": "กลางวัน (Noon)",
        "Evening": "เย็น (Evening)",
        "Bedtime": "ก่อนนอน (Bedtime)"
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <Pill className="w-8 h-8 text-rose-400" />
                    แจ้งเตือนกินยา (Medication)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-500 rounded-full font-bold">
                            <Plus className="w-5 h-5 mr-1" /> เพิ่มยา
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>เพิ่มรายการยาใหม่</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="ชื่อยา (Medicine Name)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="ขนาด/จำนวน (Dosage, e.g. 1 เม็ด)" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
                            <select className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" value={form.time} onChange={e => setForm({ ...form, time: e.target.value as any })}>
                                {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                            </select>
                            <Button onClick={handleAdd} className="w-full bg-rose-600 font-bold">บันทึก</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                {categories.map(cat => {
                    const meds = data.meds ? data.meds.filter(m => m.time === cat) : [];
                    if (meds.length === 0) return null;

                    return (
                        <div key={cat} className="space-y-3">
                            <h3 className="text-rose-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {categoryLabels[cat]}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {meds.map(med => (
                                    <div key={med.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${med.taken ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
                                        <div onClick={() => toggleMed(med.id)} className="flex-1 cursor-pointer flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${med.taken ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                                                {med.taken && <Check className="w-4 h-4 text-black" />}
                                            </div>
                                            <div>
                                                <p className={`font-bold ${med.taken ? 'text-zinc-500 line-through' : 'text-white'}`}>{med.name}</p>
                                                <p className="text-xs text-zinc-500">{med.dosage}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteMed(med.id)} className="text-zinc-600 hover:text-red-500 p-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {(data.meds || []).length === 0 && <p className="text-center text-zinc-500 py-12">ไม่มีรายการยา (No medications added)</p>}
            </div>
        </div>
    );
}

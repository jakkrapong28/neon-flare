"use client";

import { useWorkSystem } from "@/hooks/useWorkSystem";
import { Target, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function OKRPage() {
    const { data, addOKR } = useWorkSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [obj, setObj] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addOKR({ objective: obj, keyResults: [] });
        setIsOpen(false);
        setObj('');
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-2">
                        <Target className="w-8 h-8 text-fuchsia-500" />
                        เป้าหมายไตรมาส (OKRs)
                    </h1>
                    <p className="text-zinc-400">ติดตามเป้าหมายและผลลัพธ์สำคัญ (Objectives and Key Results)</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl px-6">
                            <Plus className="w-5 h-5 mr-2" /> ตั้งเป้าหมายใหม่
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>ตั้งเป้าหมายใหม่ (New Objective)</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <label className="text-sm text-zinc-400">Objective (สิ่งที่ต้องการบรรลุ)</label>
                            <input required placeholder="เช่น เป็น Senior Developer ภายในปีหน้า..." className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={obj} onChange={e => setObj(e.target.value)} />
                            <Button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 font-bold">สร้างเป้าหมาย</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {data.okrs.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-2xl">
                        <p className="text-zinc-500">ยังไม่มีเป้าหมาย OKR... เริ่มตั้งเป้าหมายใหญ่กันเถอะ!</p>
                    </div>
                )}

                {data.okrs.map(okr => (
                    <div key={okr.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-white max-w-2xl">{okr.objective}</h3>
                            <div className="text-right">
                                <span className="text-4xl font-black text-fuchsia-500">{okr.progress}%</span>
                                <p className="text-xs text-zinc-500 uppercase font-bold mt-1">Completion</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mb-8">
                            <div
                                className="h-full bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full transition-all duration-1000"
                                style={{ width: `${okr.progress}%` }}
                            />
                        </div>

                        {/* Key Results Placeholder - Real logic would involve sub-items */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-zinc-400 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 group-hover:border-fuchsia-500 transition-colors" />
                                <span className="flex-1 font-medium">Add Key Result...</span>
                                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

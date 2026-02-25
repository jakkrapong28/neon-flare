"use client";

import { useHealthSystem } from "@/hooks/useHealthSystem";
import { Moon, Clock, BedDouble } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SleepPage() {
    const { data, addSleep } = useHealthSystem();
    const [start, setStart] = useState("23:00");
    const [end, setEnd] = useState("07:00");

    const handleSave = () => {
        addSleep({
            date: new Date().toISOString().split('T')[0],
            startTime: start,
            endTime: end
        });
        alert("บันทึกการนอนเรียบร้อย!");
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Moon className="w-8 h-8 text-indigo-400" />
                การนอนหลับ (Sleep)
            </h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="space-y-4 w-full">
                        <label className="block text-zinc-400 text-sm font-bold uppercase">เวลาเข้านอน (Bedtime)</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={start}
                                onChange={e => setStart(e.target.value)}
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-2xl font-mono text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <Moon className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                        </div>
                    </div>

                    <div className="hidden md:block text-zinc-600">
                        <Clock className="w-8 h-8" />
                    </div>

                    <div className="space-y-4 w-full">
                        <label className="block text-zinc-400 text-sm font-bold uppercase">เวลาตื่นนอน (Wake up)</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={end}
                                onChange={e => setEnd(e.target.value)}
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-2xl font-mono text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-500 rounded-full w-2 h-2 shadow-[0_0_10px_#f59e0b]" />
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 py-6 text-lg font-bold rounded-xl">
                    บันทึกข้อมูล (Save Log)
                </Button>
            </div>

            {/* History List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">ประวัติย้อนหลัง (History)</h3>
                {data.sleep.map(record => (
                    <div key={record.id} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center">
                                <BedDouble className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-bold text-white">{record.date}</p>
                                <p className="text-xs text-zinc-500">{record.startTime} - {record.endTime}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-white">{record.duration}h</p>
                            <p className="text-xs text-zinc-500">Duration</p>
                        </div>
                    </div>
                ))}
                {data.sleep.length === 0 && <p className="text-zinc-500 text-center py-8">ยังไม่มีข้อมูลการนอน</p>}
            </div>
        </div>
    );
}

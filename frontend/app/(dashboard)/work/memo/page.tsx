"use client";

import { useState } from "react";
import { useWorkSystem } from "@/hooks/useWorkSystem";
import { Mic, Square, Play, Trash2 } from "lucide-react";

export default function MemoPage() {
    const { data, addMemo, deleteMemo } = useWorkSystem();
    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleRecord = () => {
        if (isRecording) {
            // Stop
            if (timerInterval) clearInterval(timerInterval);
            setIsRecording(false);
            addMemo(`บันทึกเสียง #${data.memos.length + 1}`, formatTime(seconds));
            setSeconds(0);
        } else {
            // Start
            setIsRecording(true);
            const interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
            setTimerInterval(interval);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <Mic className="w-8 h-8 text-rose-500" />
                บันทึกเสียง (Voice Memos)
            </h1>

            {/* Recorder */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                {isRecording && (
                    <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />
                )}

                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-rose-500 scale-110 shadow-[0_0_50px_rgba(244,63,94,0.5)]' : 'bg-zinc-800'}`}>
                    <Mic className={`w-12 h-12 ${isRecording ? 'text-white' : 'text-zinc-500'}`} />
                </div>

                <div className="text-center z-10">
                    <p className="text-4xl font-mono font-bold text-white">
                        {formatTime(seconds)}
                    </p>
                    <p className="text-zinc-500 mt-2">{isRecording ? "กำลังบันทึก..." : "แตะเพื่อเริ่ม"}</p>
                </div>

                <button
                    onClick={handleRecord}
                    className={`px-8 py-3 rounded-full font-bold text-lg z-10 transition-all ${isRecording ? 'bg-white text-black hover:bg-zinc-200' : 'bg-rose-600 text-white hover:bg-rose-500'}`}
                >
                    {isRecording ? <span className="flex items-center gap-2"><Square className="w-4 h-4 fill-current" /> หยุดบันทึก</span> : "เริ่มบันทึก"}
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {data.memos.length === 0 && <p className="text-center text-zinc-500 py-10">ยังไม่มีรายการบันทึก</p>}
                {data.memos.map(memo => (
                    <div key={memo.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-rose-500/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center cursor-pointer hover:bg-rose-500/20">
                                <Play className="w-4 h-4 text-white ml-0.5" />
                            </div>
                            <div>
                                <p className="font-bold text-white">{memo.title}</p>
                                <p className="text-xs text-zinc-500">{memo.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-zinc-600 text-sm">{memo.duration || '00:00'}</span>
                            <button onClick={() => confirm("ลบไฟล์เสียงนี้?") && deleteMemo(memo.id)} className="text-zinc-600 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

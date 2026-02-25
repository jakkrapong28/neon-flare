"use client";

import { useSoulSystem, MoodType } from "@/hooks/useSoulSystem";
import { Smile, Frown, Meh, Zap, CloudRain } from "lucide-react";
import { useState } from "react";

export default function MoodPage() {
    const { data, addMood } = useSoulSystem();
    const [selected, setSelected] = useState<MoodType | null>(null);

    const moods: { type: MoodType; label: string; icon: any; color: string }[] = [
        { type: 'Happy', label: 'มีความสุข', icon: Smile, color: 'text-amber-400' },
        { type: 'Calm', label: 'สงบ / เฉยๆ', icon: CloudRain, color: 'text-sky-400' },
        { type: 'Tired', label: 'เหนื่อยล้า', icon: Meh, color: 'text-zinc-400' },
        { type: 'Sad', label: 'เศร้าใจ', icon: Frown, color: 'text-indigo-400' },
        { type: 'Angry', label: 'หงุดหงิด', icon: Zap, color: 'text-rose-500' },
    ];

    const handleSelect = (mood: MoodType) => {
        addMood(mood);
        setSelected(mood);
        setTimeout(() => setSelected(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 text-center">
            <h1 className="text-4xl font-black text-white mb-4">วันนี้คุณรู้สึกอย่างไร?</h1>
            <p className="text-zinc-400 mb-12">เลือกไอคอนที่ตรงกับความรู้สึกของคุณมากที่สุด</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                {moods.map(m => (
                    <button
                        key={m.type}
                        onClick={() => handleSelect(m.type)}
                        className={`group p-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all flex flex-col items-center gap-4 ${selected === m.type ? 'ring-2 ring-white scale-105' : ''}`}
                    >
                        <m.icon className={`w-12 h-12 ${m.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                        <span className="font-bold text-white text-sm">{m.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-zinc-950 rounded-3xl p-8 border border-zinc-900 text-left">
                <h3 className="text-xl font-bold text-white mb-6">ประวัติอารมณ์ (Mood History)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.moods.slice(0, 9).map(m => (
                        <div key={m.id} className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <div className={`w-2 h-full rounded-full ${moods.find(x => x.type === m.mood)?.color.replace('text-', 'bg-') || 'bg-white'}`} />
                            <div>
                                <p className="font-bold text-white">{moods.find(x => x.type === m.mood)?.label || m.mood}</p>
                                <p className="text-xs text-zinc-500">{new Date(m.timestamp).toLocaleString('th-TH')}</p>
                            </div>
                        </div>
                    ))}
                    {data.moods.length === 0 && <p className="text-zinc-600 col-span-full text-center">ยังไม่มีข้อมูลอารมณ์</p>}
                </div>
            </div>
        </div>
    );
}

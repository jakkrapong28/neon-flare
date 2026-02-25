"use client";

import { useSoulSystem } from "@/hooks/useSoulSystem";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GratitudePage() {
    const { data, addGratitude } = useSoulSystem();
    const [lines, setLines] = useState(['', '', '']);
    const [doneToday, setDoneToday] = useState(false);

    const handleSave = () => {
        if (lines.every(l => l.trim())) {
            addGratitude(lines);
            setLines(['', '', '']);
            setDoneToday(true);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                บันทึกความสุข (Gratitude Journal)
            </h1>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
                <h3 className="text-xl font-bold text-white text-center mb-6">วันนี้มีเรื่องดีๆ อะไรเกิดขึ้นบ้าง?</h3>

                {lines.map((line, i) => (
                    <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: `${i * 100}ms` }}>
                        <span className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">{i + 1}</span>
                        <input
                            className="flex-1 bg-black border border-zinc-700 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-pink-500"
                            placeholder="สิ่งที่คุณรู้สึกขอบคุณ..."
                            value={lines[i]}
                            onChange={e => {
                                const newLines = [...lines];
                                newLines[i] = e.target.value;
                                setLines(newLines);
                            }}
                        />
                    </div>
                ))}

                <Button onClick={handleSave} className="w-full bg-pink-600 hover:bg-pink-500 py-6 text-lg font-bold rounded-xl mt-4">
                    <Sparkles className="w-5 h-5 mr-2" /> บันทึกความรู้สึกดี
                </Button>
            </div>

            {/* History */}
            <div className="mt-12 space-y-6">
                <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">บันทึกที่ผ่านมา</h3>
                {data.gratitude.map(entry => (
                    <div key={entry.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
                        <p className="text-xs text-zinc-500 font-bold mb-2">{new Date(entry.date).toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
                        <ul className="space-y-2">
                            {entry.items.map((item, idx) => (
                                <li key={idx} className="flex gap-2 items-start text-zinc-300">
                                    <span className="text-pink-500">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

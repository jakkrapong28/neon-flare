"use client";

import { useKnowledgeSystem } from "@/hooks/useKnowledgeSystem";
import { BrainCircuit, FlipHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FlashcardsPage() {
    const { data, addCard, deleteCard } = useKnowledgeSystem();
    const [flipped, setFlipped] = useState<Record<string, boolean>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ front: '', back: '' });

    const handleFlip = (id: string) => {
        setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAdd = () => {
        addCard(form.front, form.back);
        setIsOpen(false);
        setForm({ front: '', back: '' });
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <BrainCircuit className="w-8 h-8 text-fuchsia-400" />
                    ช่วยจำ (Flashcards)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full">
                            <Plus className="w-5 h-5 mr-1" /> Add Card
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>เพิ่มการ์ดใหม่</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <textarea className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="คำถาม / คำศัพท์ (Front)" rows={3} value={form.front} onChange={e => setForm({ ...form, front: e.target.value })} />
                            <textarea className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="คำตอบ / ความหมาย (Back)" rows={3} value={form.back} onChange={e => setForm({ ...form, back: e.target.value })} />
                            <Button onClick={handleAdd} className="w-full bg-fuchsia-600 font-bold">บันทึก</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.flashcards.map(card => (
                    <div key={card.id} className="relative h-64 perspective-1000 group cursor-pointer" onClick={() => handleFlip(card.id)}>
                        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${flipped[card.id] ? 'rotate-y-180' : ''}`}>

                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl hover:border-fuchsia-500/50 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-4">{card.front}</h3>
                                <p className="text-zinc-500 text-sm mt-auto">Click to reveal</p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden bg-fuchsia-900/20 border border-fuchsia-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center rotate-y-180 shadow-[0_0_30px_rgba(232,121,249,0.1)]">
                                <p className="text-lg text-fuchsia-100 font-bold">{card.back}</p>
                                <button onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }} className="absolute top-4 right-4 text-fuchsia-400/50 hover:text-red-400">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>

            {data.flashcards.length === 0 && <p className="text-center text-zinc-500 py-12">ยังไม่มีการ์ดช่วยจำ</p>}
        </div>
    );
}

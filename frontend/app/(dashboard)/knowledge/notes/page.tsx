"use client";

import { useKnowledgeSystem } from "@/hooks/useKnowledgeSystem";
import { StickyNote, Hash, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
    const { data, addNote, deleteNote } = useKnowledgeSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', tags: '' });

    const handleAdd = () => {
        if (form.title || form.content) {
            addNote({
                title: form.title,
                content: form.content,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
            });
            setIsOpen(false);
            setForm({ title: '', content: '', tags: '' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <StickyNote className="w-8 h-8 text-yellow-400" />
                    สมุดโน้ต (Notes)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full">
                            <Plus className="w-5 h-5 mr-1" /> Add Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>เพิ่มโน้ตใหม่</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="หัวข้อ (Title)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <textarea className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white h-32" placeholder="เนื้อหา (Content)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="Tags (comma separated, e.g. Idea, Work)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                            <Button onClick={handleAdd} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold">บันทึก</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {data.notes.map(note => (
                    <div key={note.id} className="break-inside-avoid bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors group">
                        {note.title && <h3 className="font-bold text-white mb-2 text-lg">{note.title}</h3>}
                        <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {note.tags.map((tag, i) => (
                                <span key={i} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full flex items-center">
                                    <Hash className="w-3 h-3 mr-1 opacity-50" /> {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-600">
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            <button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {data.notes.length === 0 && <p className="text-center text-zinc-500 py-12">ยังไม่มีโน้ต</p>}
        </div>
    );
}

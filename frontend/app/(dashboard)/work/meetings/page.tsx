"use client";

import { useWorkSystem } from "@/hooks/useWorkSystem";
import { Calendar, Clock, Link as LinkIcon, Plus, Video } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MeetingsPage() {
    const { data, addMeeting } = useWorkSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ title: '', date: '', time: '', link: '' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addMeeting(form);
        setIsOpen(false);
        setForm({ title: '', date: '', time: '', link: '' });
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <Video className="w-8 h-8 text-cyan-500" />
                    นัดหมายประชุม (Meetings)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl">
                            <Plus className="w-5 h-5 mr-2" /> เพิ่มนัดหมาย
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <input required placeholder="หัวข้อประชุม" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="date" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                <input required type="time" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                            </div>
                            <input placeholder="Video Link (Google Meet/Zoom)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold">บันทึก</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {data.meetings.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-2xl">
                        <p className="text-zinc-500">ไม่มีนัดหมายเร็วๆ นี้ (ว่างงาน? หรือลืมจด?)</p>
                    </div>
                )}

                {data.meetings.map(m => (
                    <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-cyan-500/50 transition-all">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-zinc-950 rounded-xl border border-zinc-800 text-cyan-500 font-bold">
                                <span className="text-xs uppercase">{new Date(m.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="text-2xl">{new Date(m.date).getDate()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{m.title}</h3>
                                <div className="flex items-center gap-4 text-zinc-400 text-sm mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {m.time}</span>
                                    {m.link && <span className="flex items-center gap-1 text-cyan-400"><LinkIcon className="w-4 h-4" /> Available</span>}
                                </div>
                            </div>
                        </div>
                        {m.link && (
                            <a href={m.link} target="_blank" className="px-6 py-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg font-bold transition-all text-sm">
                                Join Now
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

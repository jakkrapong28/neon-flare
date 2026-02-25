"use client";

import { useWorkSystem, Task } from "@/hooks/useWorkSystem";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function MatrixPage() {
    const { data, addTask } = useWorkSystem();
    const [newTasks, setNewTasks] = useState<Record<string, string>>({});

    const handleAdd = (priority: Task['priority']) => {
        const title = newTasks[priority];
        if (title) {
            addTask({ title, priority });
            setNewTasks({ ...newTasks, [priority]: '' });
        }
    };

    // Sub-component for Cleaner Code
    const MatrixQuadrant = ({ title, color, priority, data }: { title: string, color: string, priority: Task['priority'], data: any }) => {
        return (
            <>
                <h3 className={`font-black text-lg ${color} mb-4 uppercase tracking-wider`}>{title}</h3>

                <div className="flex-1 space-y-2 overflow-y-auto mb-4 custom-scrollbar">
                    {data.tasks.filter((t: any) => t.priority === priority && t.status !== 'done').map((t: any) => (
                        <div key={t.id} className="bg-black/40 p-3 rounded-lg border border-white/5 text-white shadow-sm text-sm">
                            {t.title}
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const Quadrant = ({ title, priority, color, bg }: { title: string, priority: Task['priority'], color: string, bg: string }) => (
        <div className={`p-4 rounded-2xl border-2 ${bg} h-full flex flex-col`}>
            <MatrixQuadrant title={title} color={color} priority={priority} data={data} />

            <div className="flex gap-2">
                <input
                    className="flex-1 bg-black/20 border-none rounded p-2 text-white text-sm placeholder:text-white/30"
                    placeholder="+ Add Task"
                    value={newTasks[priority] || ''}
                    onChange={e => setNewTasks({ ...newTasks, [priority]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAdd(priority)}
                />
                <button onClick={() => handleAdd(priority)} className={`p-2 rounded ${color.replace('text-', 'bg-')} text-black`}>
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-100px)] p-2">
            <h1 className="text-2xl font-black text-white mb-6">ลำดับความสำคัญ (Eisenhower Matrix)</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[calc(100%-60px)]">
                <Quadrant
                    title="🔥 ทำทันที (Do First)"
                    priority="high"
                    color="text-rose-500"
                    bg="border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10"
                />
                <Quadrant
                    title="📅 วางแผน (Schedule)"
                    priority="medium"
                    color="text-blue-500"
                    bg="border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
                />
                <Quadrant
                    title="✋ มอบหมาย (Delegate)"
                    priority="low"
                    color="text-amber-500"
                    bg="border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                />
                <Quadrant
                    title="🗑️ ลบทิ้ง (Delete)"
                    priority="low"
                    color="text-zinc-500"
                    bg="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                />
            </div>
        </div>
    );
}

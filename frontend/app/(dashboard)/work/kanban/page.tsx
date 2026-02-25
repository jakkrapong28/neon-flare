"use client";

import { useState } from "react";
import { useWorkSystem, Task } from "@/hooks/useWorkSystem";
import { Plus, GripVertical, CheckCircle, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function KanbanPage() {
    const { data, addTask, updateTaskStatus, deleteTask } = useWorkSystem();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Simple drag simulation by clicking arrows for now to save time on DnD library setup
    const moveTask = (task: Task, direction: 'forward' | 'back') => {

        const map = { 'todo': 0, 'doing': 1, 'done': 2 };
        const revMap = ['todo', 'doing', 'done'] as const;

        const currentIdx = map[task.status];
        const newIdx = direction === 'forward' ? currentIdx + 1 : currentIdx - 1;

        if (newIdx >= 0 && newIdx <= 2) {
            updateTaskStatus(task.id, revMap[newIdx]);
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addTask({ title: newTaskTitle, priority: 'high' });
        setNewTaskTitle('');
    };

    return (
        <div className="h-[calc(100vh-120px)] overflow-hidden flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                    กระดานงาน (Kanban)
                </h1>

                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white min-w-[300px]"
                        placeholder="เพิ่มงานใหม่..."
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                    />
                    <Button type="submit" className="bg-white text-black hover:bg-zinc-200 font-bold">
                        <Plus className="w-5 h-5 mr-1" /> เพิ่ม
                    </Button>
                </form>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
                {/* Columns */}
                {(['todo', 'doing', 'done'] as const).map((status) => (
                    <div key={status} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col h-full">
                        <div className={`p-4 border-b border-zinc-800 font-bold flex justify-between ${status === 'todo' ? 'text-zinc-400' :
                            status === 'doing' ? 'text-blue-400' : 'text-emerald-400'
                            }`}>
                            <span>{status === 'todo' ? 'รอทำ (To Do)' : status === 'doing' ? 'กำลังทำ (Doing)' : 'เสร็จแล้ว (Done)'}</span>
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-white">
                                {data.tasks.filter(t => t.status === status).length}
                            </span>
                        </div>

                        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {data.tasks.filter(t => t.status === status).map(task => (
                                <div key={task.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 group hover:border-zinc-600 transition-all shadow-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-white text-sm leading-snug">{task.title}</p>
                                        <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${task.priority === 'high' ? 'bg-red-900/30 text-red-400 border-red-900' :
                                            task.priority === 'medium' ? 'bg-blue-900/30 text-blue-400 border-blue-900' :
                                                'bg-zinc-800 text-zinc-400 border-zinc-700'
                                            }`}>
                                            {task.priority === 'high' ? '🔥 High' : task.priority === 'medium' ? '📅 Medium' : '☕ Low'}
                                        </span>
                                        {status !== 'todo' && (
                                            <button onClick={() => moveTask(task, 'back')} className="text-xs text-zinc-500 hover:text-white bg-zinc-900 px-2 py-1 rounded">
                                                ← ย้อนกลับ
                                            </button>
                                        )}
                                        {status !== 'done' && (
                                            <button onClick={() => moveTask(task, 'forward')} className="text-xs text-black font-bold bg-white hover:bg-zinc-200 px-2 py-1 rounded ml-auto">
                                                ถัดไป →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {data.tasks.filter(t => t.status === status).length === 0 && (
                                <div className="text-center py-10 text-zinc-600 text-sm border-2 border-dashed border-zinc-800/50 rounded-xl">
                                    ว่างเปล่า
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

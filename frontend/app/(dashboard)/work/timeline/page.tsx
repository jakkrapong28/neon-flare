"use client";

import { useWorkSystem } from "@/hooks/useWorkSystem";
import { Calendar, Circle, Clock, CheckCircle2 } from "lucide-react";

export default function TimelinePage() {
    const { data } = useWorkSystem();

    // Sort Tasks by Due Date
    const sortedTasks = [...data.tasks]
        .filter(t => t.dueDate)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    // Group by Date
    const grouped = sortedTasks.reduce((acc, task) => {
        const date = task.dueDate!.split('T')[0]; // Ensure we group by Day (YYYY-MM-DD)
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
        return acc;
    }, {} as Record<string, typeof data.tasks>);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-8">
                <Calendar className="w-8 h-8 text-sky-500" />
                Timeline (Gantt View)
            </h1>

            <div className="relative border-l-2 border-zinc-800 ml-4 space-y-12">
                {Object.keys(grouped).length === 0 && (
                    <div className="ml-8 py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-zinc-500 italic text-lg">ไม่มีกำหนดการส่งงานเร็วๆ นี้ (No upcoming deadlines)</p>
                        <a href="/work/kanban" className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors">
                            เพิ่มวันกำหนดส่งใน Kanban
                        </a>
                    </div>
                )}

                {Object.entries(grouped).map(([date, tasks]) => (
                    <div key={date} className="relative ml-8">
                        {/* Dot */}
                        <div className="absolute -left-[41px] top-0 w-5 h-5 bg-zinc-900 border-2 border-sky-500 rounded-full" />

                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>

                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:bg-zinc-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-zinc-600" />}
                                        <span className={task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'}>{task.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-950 px-2 py-1 rounded">
                                        <Clock className="w-3 h-3" />
                                        {task.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

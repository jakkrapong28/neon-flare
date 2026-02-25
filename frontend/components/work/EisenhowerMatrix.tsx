"use client";
import React, { useState, useEffect } from "react";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { useTranslations } from "next-intl";

export function EisenhowerMatrix() {
    const t = useTranslations('Work'); // Assuming 'Work' namespace exists or fallback
    const tCommon = useTranslations('Common');
    const [tasks, setTasks] = useState<any[]>([]);
    const [matrix, setMatrix] = useState({
        doFirst: [] as any[],
        schedule: [] as any[],
        delegate: [] as any[],
        delete: [] as any[]
    });
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:3005/api/productivity/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
            // Initial simple classification (if not already classified, put all in 'schedule' or 'doFirst' based on priority)
            // For now, let's just show them unorganized or pre-organized if backend supports it.
            // As a fallback, we put everything in Schedule to let AI sort it.
            setMatrix(prev => ({ ...prev, schedule: res.data }));
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAiPrioritize = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        setLoading(true);
        try {
            // Send current tasks (or fetched tasks) to AI
            const res = await axios.post("http://localhost:3005/api/productivity/prioritize", { tasks }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Assume AI returns list with 'matrix_quadrant' or similar
            // Let's parse the response. Response logic from GeminiService:
            // Returns array of tasks with priority and matrix_quadrant
            const organizedTasks = res.data;
            const newMatrix = {
                doFirst: organizedTasks.filter((t: any) => t.matrix_quadrant === 'Do First' || t.priority === 'urgent'),
                schedule: organizedTasks.filter((t: any) => t.matrix_quadrant === 'Schedule' || t.priority === 'high'),
                delegate: organizedTasks.filter((t: any) => t.matrix_quadrant === 'Delegate' || t.priority === 'medium'),
                delete: organizedTasks.filter((t: any) => t.matrix_quadrant === 'Delete' || t.priority === 'low')
            };
            setMatrix(newMatrix);

        } catch (error) {
            console.error("AI Prioritize failed", error);
            alert("AI Optimization failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Eisenhower Matrix</h3>
                <Button
                    size="sm"
                    onClick={handleAiPrioritize}
                    disabled={loading || tasks.length === 0}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
                >
                    <Sparkles className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "AI Organizing..." : "AI Organize"}
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                <div className="bg-zinc-900/50 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 p-4 rounded-xl flex flex-col">
                    <h3 className="text-red-400 font-bold mb-2 text-sm uppercase tracking-wider">ทำทันที (Do First)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            {matrix.doFirst.map((t, i) => <li key={t._id || i} className="bg-red-500/10 p-2 rounded text-sm text-zinc-300 border-l-2 border-red-500">{t.title || t}</li>)}
                        </ul>
                    </PrivacyBlur>
                </div>
                <div className="bg-zinc-900/50 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 p-4 rounded-xl flex flex-col">
                    <h3 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">วางแผน (Schedule)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            {matrix.schedule.map((t, i) => <li key={t._id || i} className="bg-blue-500/10 p-2 rounded text-sm text-zinc-300 border-l-2 border-blue-500">{t.title || t}</li>)}
                        </ul>
                    </PrivacyBlur>
                </div>
                <div className="bg-zinc-900/50 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 p-4 rounded-xl flex flex-col">
                    <h3 className="text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">กระจายงาน (Delegate)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            {matrix.delegate.map((t, i) => <li key={t._id || i} className="bg-yellow-500/10 p-2 rounded text-sm text-zinc-300 border-l-2 border-yellow-500">{t.title || t}</li>)}
                        </ul>
                    </PrivacyBlur>
                </div>
                <div className="bg-zinc-900/50 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 p-4 rounded-xl flex flex-col">
                    <h3 className="text-zinc-400 font-bold mb-2 text-sm uppercase tracking-wider">กำจัดทิ้ง (Delete)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            {matrix.delete.map((t, i) => <li key={t._id || i} className="bg-zinc-500/10 p-2 rounded text-sm text-zinc-300 border-l-2 border-zinc-500">{t.title || t}</li>)}
                        </ul>
                    </PrivacyBlur>
                </div>
            </div>
        </div>
    );
}

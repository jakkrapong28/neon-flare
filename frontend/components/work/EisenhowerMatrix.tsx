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
        <div className="flex flex-col h-full gap-4 font-sans text-foreground">
            <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-foreground uppercase tracking-wider font-mono">Eisenhower Matrix</h3>
                <Button
                    size="sm"
                    onClick={handleAiPrioritize}
                    disabled={loading || tasks.length === 0}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold transition-all cursor-pointer rounded-lg px-4 shadow-sm"
                >
                    <Sparkles className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "AI Organizing..." : "AI Organize"}
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                {/* Do First (Laser Red / Destructive) */}
                <div className="bg-card border border-destructive/25 hover:border-destructive/40 shadow-sm p-3 rounded-xl flex flex-col transition-all duration-300">
                    <h3 className="text-destructive font-black mb-2 text-[10px] uppercase tracking-widest font-mono">ทำทันที (Do First)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-1.5">
                            {matrix.doFirst.map((t, i) => (
                                <li key={t._id || i} className="bg-destructive/5 p-2 rounded text-xs text-foreground border-l-2 border-destructive">
                                    {t.title || t}
                                </li>
                            ))}
                        </ul>
                    </PrivacyBlur>
                </div>

                {/* Schedule (Primary Accent) */}
                <div className="bg-card border border-primary/20 hover:border-primary/40 shadow-sm p-3 rounded-xl flex flex-col transition-all duration-300">
                    <h3 className="text-cyan-600 font-black mb-2 text-[10px] uppercase tracking-widest font-mono">วางแผน (Schedule)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-1.5">
                            {matrix.schedule.map((t, i) => (
                                <li key={t._id || i} className="bg-cyan-500/5 p-2 rounded text-xs text-foreground border-l-2 border-cyan-500">
                                    {t.title || t}
                                </li>
                            ))}
                        </ul>
                    </PrivacyBlur>
                </div>

                {/* Delegate (Pink / Accent) */}
                <div className="bg-card border border-pink-500/20 hover:border-pink-500/40 shadow-sm p-3 rounded-xl flex flex-col transition-all duration-300">
                    <h3 className="text-pink-600 font-black mb-2 text-[10px] uppercase tracking-widest font-mono">กระจายงาน (Delegate)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-1.5">
                            {matrix.delegate.map((t, i) => (
                                <li key={t._id || i} className="bg-pink-500/5 p-2 rounded text-xs text-foreground border-l-2 border-pink-500">
                                    {t.title || t}
                                </li>
                            ))}
                        </ul>
                    </PrivacyBlur>
                </div>

                {/* Delete (Muted Gray) */}
                <div className="bg-card border border-border hover:border-zinc-300 shadow-sm p-3 rounded-xl flex flex-col transition-all duration-300">
                    <h3 className="text-muted-foreground font-black mb-2 text-[10px] uppercase tracking-widest font-mono">กำจัดทิ้ง (Delete)</h3>
                    <PrivacyBlur className="flex-1 overflow-y-auto">
                        <ul className="space-y-1.5">
                            {matrix.delete.map((t, i) => (
                                <li key={t._id || i} className="bg-muted p-2 rounded text-xs text-muted-foreground border-l-2 border-zinc-400">
                                    {t.title || t}
                                </li>
                            ))}
                        </ul>
                    </PrivacyBlur>
                </div>
            </div>
        </div>
    );
}

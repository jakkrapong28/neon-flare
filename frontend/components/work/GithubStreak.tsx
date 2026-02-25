"use client";
import { Github } from "lucide-react";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";

export function GithubStreak() {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
                <Github className="animate-pulse text-white" />
                <h3 className="font-bold">Code Streak</h3>
            </div>
            <PrivacyBlur intensity="sm">
                <div className="flex gap-1 h-32 flex-wrap content-end">
                    {/* Mock contribution graph grid */}
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-emerald-500' : 'bg-zinc-800'}`} style={{ opacity: Math.random() * 0.5 + 0.5 }}></div>
                    ))}
                </div>
            </PrivacyBlur>
            <div className="mt-4 text-xs text-zinc-500">
                Current Streak: <span className="text-emerald-400 font-bold">12 Days</span>
            </div>
        </div>
    );
}

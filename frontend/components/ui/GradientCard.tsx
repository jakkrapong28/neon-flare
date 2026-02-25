import { LucideIcon } from "lucide-react";

interface GradientCardProps {
    title: string;
    value: number;
    trend: string;
    icon: LucideIcon;
    color: "emerald" | "blue" | "rose" | "amber" | "purple";
}

export function GradientCard({ title, value, trend, icon: Icon, color }: GradientCardProps) {
    const colors = {
        emerald: "from-emerald-500/10 to-emerald-900/5 text-emerald-500",
        blue: "from-blue-500/10 to-blue-900/5 text-blue-500",
        rose: "from-rose-500/10 to-rose-900/5 text-rose-500",
        amber: "from-amber-500/10 to-amber-900/5 text-amber-500",
        purple: "from-purple-500/10 to-purple-900/5 text-purple-500",
    };

    const textColors = {
        emerald: "text-emerald-500",
        blue: "text-blue-500",
        rose: "text-rose-500",
        amber: "text-amber-500",
        purple: "text-purple-500",
    };

    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${colors[color]} border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-24 h-24" />
            </div>
            <p className="text-zinc-400 text-sm font-medium relative z-10">{title}</p>
            <div className="flex items-end gap-3 mt-2 relative z-10">
                <h2 className={`text-3xl font-black text-white`}>
                    ฿{value.toLocaleString()}
                </h2>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-black/20 ${textColors[color]}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

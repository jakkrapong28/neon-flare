import { LucideIcon } from "lucide-react";

interface GradientCardProps {
    title: string;
    value: number;
    trend: string;
    icon: LucideIcon;
    color: "emerald" | "blue" | "rose" | "amber" | "purple";
}

export function GradientCard({ title, value, trend, icon: Icon, color }: GradientCardProps) {
    const textColors = {
        emerald: "text-emerald-600 bg-emerald-50 border border-emerald-250/20",
        blue: "text-blue-600 bg-blue-50 border border-blue-250/20",
        rose: "text-rose-600 bg-rose-50 border border-rose-250/20",
        amber: "text-amber-600 bg-amber-50 border border-amber-250/20",
        purple: "text-purple-600 bg-purple-50 border border-purple-250/20",
    };

    const iconColors = {
        emerald: "text-emerald-500",
        blue: "text-blue-500",
        rose: "text-rose-500",
        amber: "text-amber-500",
        purple: "text-purple-500",
    };

    return (
        <div className="p-6 rounded-2xl bg-card border border-border relative overflow-hidden group hover:border-zinc-300 transition-all shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className={`w-24 h-24 ${iconColors[color]}`} />
            </div>
            <p className="text-muted-foreground text-sm font-medium relative z-10">{title}</p>
            <div className="flex items-end gap-3 mt-2 relative z-10">
                <h2 className="text-3xl font-black text-foreground">
                    ฿{value.toLocaleString()}
                </h2>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${textColors[color]}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

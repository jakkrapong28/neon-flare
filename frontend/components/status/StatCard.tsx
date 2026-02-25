import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string; // Tailwind text color class, e.g., "text-green-500"
    progressColor?: string; // Tailwind bg color class for progress, e.g., "bg-green-500"
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    progressColor = "bg-primary",
    className
}) => {
    return (
        <Card className={cn("bg-black/40 border-slate-800 backdrop-blur-md shadow-lg", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">
                    {title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", color)} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white mb-2">{value}%</div>
                <Progress value={value} className="h-2 bg-slate-800" indicatorClassName={progressColor} />
                <p className="text-xs text-slate-400 mt-2">
                    {value >= 80 ? 'Optimal' : value >= 50 ? 'Stable' : 'Critical'}
                </p>
            </CardContent>
        </Card>
    );
};

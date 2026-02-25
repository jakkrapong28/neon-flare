"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";

const data = [
    { subject: 'การเงิน', A: 120, fullMark: 150 },
    { subject: 'การงาน', A: 98, fullMark: 150 },
    { subject: 'สุขภาพ', A: 86, fullMark: 150 },
    { subject: 'จิตใจ', A: 99, fullMark: 150 },
    { subject: 'ความรู้', A: 85, fullMark: 150 },
];



interface LifeRadarProps {
    data?: any[];
}

export function LifeRadar({ data: propData }: LifeRadarProps) {
    const displayData = propData && propData.length > 0 ? propData : [
        { subject: 'การเงิน', A: 20, fullMark: 150 },
        { subject: 'การงาน', A: 20, fullMark: 150 },
        { subject: 'สุขภาพ', A: 20, fullMark: 150 },
        { subject: 'จิตใจ', A: 20, fullMark: 150 },
        { subject: 'ความรู้', A: 20, fullMark: 150 },
    ];
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 pointer-events-none"></div>
            <h3 className="z-10 text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">สมดุลชีวิต (Life Balance)</h3>
            <div className="flex-1 w-full z-10 min-h-[250px]">
                <PrivacyBlur intensity="lg">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={displayData}>
                            <PolarGrid stroke="#3f3f46" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 13, fontWeight: 500 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="My LifeOS"
                                dataKey="A"
                                stroke="#eca400"
                                strokeWidth={2}
                                fill="#eca400"
                                fillOpacity={0.3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </PrivacyBlur>
            </div>
        </div>
    );
}

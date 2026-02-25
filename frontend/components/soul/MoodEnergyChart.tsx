"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";

const data = [
    { time: "08:00", mood: 6, energy: 9 },
    { time: "10:00", mood: 7, energy: 8 },
    { time: "12:00", mood: 5, energy: 6 },
    { time: "15:00", mood: 4, energy: 4 },
    { time: "18:00", mood: 8, energy: 2 },
    { time: "22:00", mood: 9, energy: 1 },
];

export function MoodEnergyChart() {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Energy vs Mood Correlation</h3>
            <div className="h-[300px] w-full">
                <PrivacyBlur intensity="md">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Mood" />
                            <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Energy" />
                        </LineChart>
                    </ResponsiveContainer>
                </PrivacyBlur>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
                Insight: <span className="text-violet-400">10:00 AM</span> is your peak productivity window.
            </p>
        </div>
    );
}

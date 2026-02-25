"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Scale } from "lucide-react";

import { HydrationWidget } from "@/components/health/HydrationWidget";
import { HealthLogForm } from "@/components/health/HealthLogForm";

export default function HealthPage() {
    const weightData = [
        { date: '1 Jan', weight: 70 },
        { date: '8 Jan', weight: 69.5 },
        { date: '15 Jan', weight: 69.2 },
        { date: '22 Jan', weight: 68.8 },
        { date: '29 Jan', weight: 69.0 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                    สุขภาพร่างกาย (Physical Health)
                </h1>
                <p className="text-zinc-400">ติดตามการออกกำลังกายและน้ำหนักของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Weight Chart */}
                <div className="md:col-span-2 rounded-xl border border-emerald-500/30 bg-zinc-950/80 shadow-lg shadow-emerald-500/10 p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Scale className="h-5 w-5 text-emerald-400" />
                            แนวโน้มน้ำหนัก (Weight Trend)
                        </h3>
                        <span className="text-2xl font-black text-emerald-400">69.0 <span className="text-sm text-zinc-500 font-normal">kg</span></span>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#10b981', borderRadius: '8px' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="md:col-span-1 space-y-6">
                    <HydrationWidget />
                    <HealthLogForm />
                </div>
            </div>
        </div>
    );
}

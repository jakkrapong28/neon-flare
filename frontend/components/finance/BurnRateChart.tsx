"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";

interface BurnRateChartProps {
    data: any[];
}

export function BurnRateChart({ data }: BurnRateChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
                <p className="text-zinc-500">ไม่มีข้อมูลการใช้จ่ายในช่วง 30 วันนี้</p>
            </div>
        );
    }

    const average = data.reduce((acc, curr) => acc + curr.spending, 0) / data.length;

    return (
        <div className="p-6 rounded-xl border border-yellow-500/20 bg-zinc-950/80 shadow-lg shadow-yellow-500/5">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        🔥 อัตราการเผาผลาญ (Burn Rate)
                    </h3>
                    <p className="text-sm text-zinc-400">แนวโน้มการใช้จ่าย 30 วันล่าสุด</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-500">เฉลี่ยต่อวัน</p>
                    <PrivacyBlur>
                        <p className="text-xl font-bold text-rose-400">฿ {Math.round(average).toLocaleString()}</p>
                    </PrivacyBlur>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <PrivacyBlur intensity="sm">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="day"
                                stroke="#52525b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#EAB308', borderRadius: '8px' }}
                                itemStyle={{ color: '#EAB308' }}
                                formatter={(value: number) => [`฿ ${value.toLocaleString()}`, 'Spending']}
                                labelFormatter={(label) => `Day ${label}`}
                            />
                            <ReferenceLine y={average} stroke="#EAB308" strokeDasharray="3 3" label="Avg" />
                            <Bar
                                dataKey="spending"
                                fill="#EF4444"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </PrivacyBlur>
            </div>
        </div>
    );
}

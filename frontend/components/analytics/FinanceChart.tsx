"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceAreaChartProps {
    data?: any[];
}

export function FinanceAreaChart({ data }: FinanceAreaChartProps) {
    // Fill missing data mock
    const chartData = data && data.length > 0 ? data : [
        { date: '2024-01-01', income: 4500, expense: 2300 },
        { date: '2024-01-05', income: 12000, expense: 5000 },
        { date: '2024-01-10', income: 3000, expense: 8000 },
        { date: '2024-01-15', income: 25000, expense: 12000 },
        { date: '2024-01-20', income: 5000, expense: 15000 },
        { date: '2024-01-25', income: 48000, expense: 20000 },
    ];

    return (
        <div className="w-full h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">กระแสเงินสด (Cash Flow)</h3>
                    <p className="text-xs text-zinc-600">วิเคราะห์รายรับ vs รายจ่าย</p>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2 text-yellow-500">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_currentColor]"></span> รายรับ
                    </div>
                    <div className="flex items-center gap-2 text-rose-500">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_currentColor]"></span> รายจ่าย
                    </div>
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                            </linearGradient>
                            <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#52525b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(str) => str ? str.split('-')[2] : ''}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            formatter={(value: number) => `฿${value.toLocaleString()}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#EAB308"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            filter="url(#glow)"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#F43F5E"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            filter="url(#glow)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


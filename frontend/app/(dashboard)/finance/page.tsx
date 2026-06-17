"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, ArrowRight, ScanLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { TransactionModal } from "@/components/finance/TransactionModal";
import { GradientCard } from "@/components/ui/GradientCard";

export default function FinancePage() {
    const t = useTranslations('Finance');
    const { data, mounted, getSummary, getChartData } = useFinanceSystem();
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!mounted) return;

        // Process Chart Data with selected date
        const raw = getChartData(currentDate);
        setChartData(raw);

    }, [data, mounted, currentDate, getChartData]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const { totalBalance: balance, incomeMonth: income, expenseMonth: expense } = getSummary(currentDate);

    // Filter transactions for the list
    const monthTransactions = data.transactions.filter(t =>
        t.date.startsWith(currentDate.toISOString().slice(0, 7))
    );

    if (!mounted) return <div className="p-8 text-center text-muted-foreground">Loading Finance System...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-0 text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                        <Wallet className="w-8 h-8 text-primary" />
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">ภาพรวมการเงินและกระแสเงินสด (Cash Flow & Net Worth)</p>
                </div>

                <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border border-border">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <span className="font-bold text-foreground min-w-[140px] text-center">
                        {currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => router.push('/finance/scan')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-zinc-200 text-foreground rounded-xl font-bold transition-all border border-border"
                    >
                        <ScanLine className="w-5 h-5 text-primary" />
                        สแกนสลิป (AI Scan)
                    </button>
                    <TransactionModal onSuccess={() => { }} />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GradientCard
                    title="เงินคงเหลือ (Balance)"
                    value={balance}
                    trend="Total"
                    icon={DollarSign}
                    color="emerald"
                />
                <GradientCard
                    title="รายรับ (Income)"
                    value={income}
                    trend={currentDate.toLocaleDateString('en-US', { month: 'short' })}
                    icon={TrendingUp}
                    color="blue"
                />
                <GradientCard
                    title="รายจ่าย (Expense)"
                    value={expense}
                    trend={currentDate.toLocaleDateString('en-US', { month: 'short' })}
                    icon={PieChart}
                    color="rose"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 min-h-[300px] shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-6">กระแสเงินสด (Cash Flow Trend)</h3>
                    {chartData.length > 0 ? (
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickFormatter={(val) => val.slice(8)} />
                                    <YAxis stroke="#52525b" fontSize={12} tickFormatter={(val) => `฿${val / 1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px' }}
                                        itemStyle={{ color: '#09090b' }}
                                        formatter={(val: number) => `฿${val.toLocaleString()}`}
                                    />
                                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            ยังไม่มีข้อมูลกราฟ
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-foreground">รายการเดือนนี้ (Transactions)</h3>
                        <Link href="/finance/transactions" className="text-xs text-primary hover:underline flex items-center gap-1">
                            ดูทั้งหมด <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {monthTransactions.slice(0, 5).map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                        {t.type === 'INCOME' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">{t.note || t.category}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(t.date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-mono font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} ฿{t.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {monthTransactions.length === 0 && (
                            <p className="text-center text-muted-foreground text-sm py-8">ไม่มีรายการในเดือนนี้</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

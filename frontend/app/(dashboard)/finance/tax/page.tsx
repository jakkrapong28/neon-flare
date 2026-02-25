"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Button } from "@/components/ui/button";
import { Calculator, RefreshCw } from "lucide-react";

export default function TaxPage() {
    const { getSummary } = useFinanceSystem();
    const { incomeMonth } = getSummary(); // Note: This is monthly, tax usually annual
    const [income, setIncome] = useState<string>('');
    const [deduction, setDeduction] = useState<string>('60000'); // Standard deduction

    // Thai Tax Brackets (2024 Guidelines)
    const calculateTax = (netIncome: number) => {
        let tax = 0;
        if (netIncome > 5000000) tax += (netIncome - 5000000) * 0.35 + 1265000;
        else if (netIncome > 2000000) tax += (netIncome - 2000000) * 0.30 + 365000;
        else if (netIncome > 1000000) tax += (netIncome - 1000000) * 0.25 + 115000;
        else if (netIncome > 750000) tax += (netIncome - 750000) * 0.20 + 65000;
        else if (netIncome > 500000) tax += (netIncome - 500000) * 0.15 + 27500;
        else if (netIncome > 300000) tax += (netIncome - 300000) * 0.10 + 7500;
        else if (netIncome > 150000) tax += (netIncome - 150000) * 0.05;
        // 0-150,000 Exempt
        return tax;
    };

    const annualIncome = parseFloat(income || '0');
    const totalDeduction = parseFloat(deduction || '0');
    const netTaxable = Math.max(0, annualIncome - totalDeduction);
    const taxAmount = calculateTax(netTaxable);
    const effectiveRate = annualIncome > 0 ? (taxAmount / annualIncome) * 100 : 0;

    const handleAutoFill = () => {
        // Estimate Annual = Monthly * 12
        setIncome((incomeMonth * 12).toString());
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-0">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <Calculator className="w-8 h-8 text-cyan-500" />
                    คำนวณภาษี (Tax Planner)
                </h1>
                <p className="text-zinc-400">ประมาณการภาษีเงินได้บุคคลธรรมดา (Thai Personal Income Tax)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6 bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-white">เงินได้ทั้งปี (Annual Income)</label>
                            <button onClick={handleAutoFill} className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">
                                <RefreshCw className="w-3 h-3" /> Auto-fill from System
                            </button>
                        </div>
                        <input
                            type="number"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white text-lg font-mono placeholder:text-zinc-700"
                            placeholder="0.00"
                            value={income}
                            onChange={e => setIncome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-white mb-2 block">ค่าลดหย่อน (Deductions)</label>
                        <input
                            type="number"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white text-lg font-mono placeholder:text-zinc-700"
                            value={deduction}
                            onChange={e => setDeduction(e.target.value)}
                        />
                        <p className="text-xs text-zinc-500 mt-2">*ค่าลดหย่อนส่วนตัวมาตรฐาน 60,000 บาท</p>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-center text-center space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />

                    <div className="relative z-10">
                        <p className="text-zinc-500 text-sm mb-1">เงินได้สุทธิ (Net Taxable Income)</p>
                        <h3 className="text-2xl font-bold text-white">฿{netTaxable.toLocaleString()}</h3>
                    </div>

                    <div className="relative z-10 py-6 border-y border-zinc-800/50">
                        <p className="text-zinc-400 text-sm mb-2">ภาษีที่ต้องชำระ (Estimated Tax)</p>
                        <h2 className="text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            ฿{taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </h2>
                    </div>

                    <div className="relative z-10 flex justify-between px-8">
                        <div>
                            <p className="text-xs text-zinc-500">อัตราภาษีเฉลี่ย</p>
                            <p className="font-bold text-white">{effectiveRate.toFixed(2)}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500">ฐานภาษีสูงสุด</p>
                            <p className="font-bold text-white">
                                {netTaxable > 5000000 ? '35%' :
                                    netTaxable > 2000000 ? '30%' :
                                        netTaxable > 1000000 ? '25%' :
                                            netTaxable > 750000 ? '20%' :
                                                netTaxable > 500000 ? '15%' :
                                                    netTaxable > 300000 ? '10%' :
                                                        netTaxable > 150000 ? '5%' : 'Exempt'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brackets Info */}
            <div className="rounded-xl overflow-hidden border border-zinc-800">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3">เงินได้สุทธิ (Net Income)</th>
                            <th className="px-6 py-3">อัตราภาษี (Rate)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-300">
                        <tr className={netTaxable <= 150000 ? "bg-emerald-500/10 text-emerald-400 font-bold" : ""}>
                            <td className="px-6 py-3">0 - 150,000</td>
                            <td className="px-6 py-3">ยกเว้น (Exempt)</td>
                        </tr>
                        <tr className={netTaxable > 150000 && netTaxable <= 300000 ? "bg-cyan-500/10 text-cyan-400 font-bold" : ""}>
                            <td className="px-6 py-3">150,001 - 300,000</td>
                            <td className="px-6 py-3">5%</td>
                        </tr>
                        <tr className={netTaxable > 300000 && netTaxable <= 500000 ? "bg-cyan-500/10 text-cyan-400 font-bold" : ""}>
                            <td className="px-6 py-3">300,001 - 500,000</td>
                            <td className="px-6 py-3">10%</td>
                        </tr>
                    </tbody>
                </table>
                <div className="bg-zinc-900 p-2 text-center text-xs text-zinc-500 font-mono">
                    ...แสดงเพียงบางช่วงฐานภาษี (Showing partial brackets)
                </div>
            </div>
        </div>
    );
}

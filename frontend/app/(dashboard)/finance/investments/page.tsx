"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus, Bitcoin, Building, RefreshCw } from "lucide-react";

export default function InvestmentsPage() {
    const { data, mounted, addInvestment, updateInvestmentPrice } = useFinanceSystem();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Add Asset Form
    const [form, setForm] = useState({ name: '', symbol: '', type: 'STOCK', qty: '', price: '' });
    // Update Price State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState('');

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading Portfolio...</div>;

    const totalPortfolioValue = data.investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);
    const totalCost = data.investments.reduce((acc, inv) => acc + (inv.quantity * inv.avgPrice), 0);
    const totalProfit = totalPortfolioValue - totalCost;
    const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addInvestment({
            name: form.name,
            symbol: form.symbol.toUpperCase(),
            type: form.type as any,
            quantity: parseFloat(form.qty),
            avgPrice: parseFloat(form.price),
            currentPrice: parseFloat(form.price)
        });
        setIsModalOpen(false);
        setForm({ name: '', symbol: '', type: 'STOCK', qty: '', price: '' });
    };

    const handleUpdatePrice = (id: string) => {
        if (newPrice) {
            updateInvestmentPrice(id, parseFloat(newPrice));
            setEditingId(null);
            setNewPrice('');
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                        พอร์ตการลงทุน (Portfolio)
                    </h1>
                    <p className="text-zinc-400">ติดตามมูลค่าสินทรัพย์และการเติบโต</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">มูลค่าพอร์ตลงทุนรวม</p>
                    <div className="flex items-center justify-end gap-3">
                        <p className="text-3xl font-black text-white">฿{totalPortfolioValue.toLocaleString()}</p>
                        <span className={`text-sm font-bold px-2 py-1 rounded ${totalProfit >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()} ({profitPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Assets List */}
            <div className="grid grid-cols-1 gap-4">
                {/* Header Row */}
                <div className="hidden md:grid grid-cols-6 gap-4 p-4 text-zinc-500 text-sm font-bold border-b border-zinc-800">
                    <div className="col-span-2">สินทรัพย์ (Asset)</div>
                    <div className="text-right">ราคาต้นทุน (Avg)</div>
                    <div className="text-right">ราคาปัจจุบัน (Market)</div>
                    <div className="text-right">จำนวน (Qty)</div>
                    <div className="text-right">มูลค่ารวม (Value)</div>
                </div>

                {data.investments.map(inv => {
                    const value = inv.quantity * inv.currentPrice;
                    const profit = value - (inv.quantity * inv.avgPrice);
                    return (
                        <div key={inv.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800 hover:border-zinc-700 items-center">
                            <div className="col-span-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    {inv.type === 'CRYPTO' ? <Bitcoin className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{inv.symbol}</p>
                                    <p className="text-xs text-zinc-500">{inv.name}</p>
                                </div>
                            </div>

                            <div className="flex justify-between md:block text-right">
                                <span className="md:hidden text-zinc-500 text-xs">Avg:</span>
                                <span className="text-zinc-400">฿{inv.avgPrice.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between md:block text-right">
                                <span className="md:hidden text-zinc-500 text-xs">Market:</span>
                                {editingId === inv.id ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <input
                                            autoFocus
                                            type="number"
                                            className="w-20 bg-black border border-zinc-700 text-white text-xs p-1 rounded"
                                            value={newPrice}
                                            onChange={e => setNewPrice(e.target.value)}
                                            onBlur={() => handleUpdatePrice(inv.id)}
                                            onKeyDown={e => e.key === 'Enter' && handleUpdatePrice(inv.id)}
                                        />
                                    </div>
                                ) : (
                                    <button onClick={() => setEditingId(inv.id)} className="text-emerald-400 font-mono hover:underline flex items-center justify-end gap-1 ml-auto">
                                        ฿{inv.currentPrice.toLocaleString()}
                                        <RefreshCw className="w-3 h-3 opacity-50" />
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-between md:block text-right">
                                <span className="md:hidden text-zinc-500 text-xs">Qty:</span>
                                <span className="text-white font-mono">{inv.quantity.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between md:block text-right">
                                <span className="md:hidden text-zinc-500 text-xs">Value:</span>
                                <div>
                                    <p className="font-bold text-white">฿{value.toLocaleString()}</p>
                                    <p className={`text-xs ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add Button */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 font-bold hover:text-white hover:border-zinc-600 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" /> เพิ่มสินทรัพย์ใหม่
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader><DialogTitle>เพิ่มสินทรัพย์ (Add Asset)</DialogTitle></DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="สัญลักษณ์ (BTC, AAPL)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white uppercase" value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} />
                                <select className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="STOCK">หุ้น (Stock)</option>
                                    <option value="CRYPTO">คริปโต (Crypto)</option>
                                    <option value="REAL_ESTATE">อสังหาฯ (Real Estate)</option>
                                    <option value="CASH">เงินสด (Cash)</option>
                                    <option value="OTHER">อื่นๆ (Other)</option>
                                </select>
                            </div>
                            <input required placeholder="ชื่อเต็ม (e.g. Bitcoin, Apple Inc.)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" placeholder="จำนวน (Quantity)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                                <input required type="number" placeholder="ราคาเฉลี่ย/หน่วย (Avg Price)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold">บันทึกเข้าพอร์ต</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

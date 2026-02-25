"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash, Zap, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Subscription {
    _id: string;
    name: string;
    amount: number;
    billingCycle: "MONTHLY" | "YEARLY";
    nextBillingDate: string;
}

export function SubscriptionList() {
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [cycle, setCycle] = useState("MONTHLY");
    const [nextDate, setNextDate] = useState("");

    const fetchSubs = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:3005/api/finance/subscriptions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubs(res.data);
        } catch (e) { console.error("Failed to fetch subscriptions", e); }
    };

    useEffect(() => { fetchSubs(); }, []);

    const handleAdd = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            await axios.post("http://localhost:3005/api/finance/subscriptions", {
                name,
                amount: parseFloat(amount),
                billingCycle: cycle,
                nextBillingDate: new Date(nextDate),
            }, { headers: { Authorization: `Bearer ${token}` } });
            setIsAddOpen(false);
            fetchSubs();
            setName(""); setAmount(""); setNextDate("");
        } catch (e) { alert("Failed to add subscription"); }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete subscription "${name}"?`)) return;
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            await axios.delete(`http://localhost:3005/api/finance/subscriptions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubs(subs.filter(s => s._id !== id));
        } catch (e) { console.error(e); }
    };

    const calculateDaysLeft = (dateStr: string) => {
        const billingDate = new Date(dateStr);
        const today = new Date();
        let nextBilling = new Date(today.getFullYear(), today.getMonth(), billingDate.getDate());
        if (nextBilling < today) {
            nextBilling = new Date(today.getFullYear(), today.getMonth() + 1, billingDate.getDate());
        }
        const diff = nextBilling.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days < 0 ? 0 : days;
    };

    const getProgress = (daysLeft: number) => {
        const percentage = ((30 - daysLeft) / 30) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    return (
        <div className="bg-zinc-950/80 rounded-xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Subscriptions
                </h3>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <button className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors border border-emerald-500/20">
                            <Plus className="w-4 h-4" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="text-white">Track Subscription</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                            <Input placeholder="Service Name (e.g. Netflix)" className="bg-zinc-900 border-zinc-800" value={name} onChange={(e: any) => setName(e.target.value)} />
                            <div className="flex gap-2">
                                <Input type="number" placeholder="Cost" className="bg-zinc-900 border-zinc-800" value={amount} onChange={(e: any) => setAmount(e.target.value)} />
                                <Select value={cycle} onValueChange={setCycle}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800 w-[140px]"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                                        <SelectItem value="YEARLY">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-500">Next Billing Date</label>
                                <Input type="date" className="bg-zinc-900 border-zinc-800 block" value={nextDate} onChange={(e: any) => setNextDate(e.target.value)} />
                            </div>
                            <button onClick={handleAdd} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-md">Save Tracker</button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {subs.length === 0 && (
                    <div className="text-center text-zinc-500 text-sm py-4 border-2 border-dashed border-zinc-800 rounded-xl">
                        No subscriptions tracked.
                    </div>
                )}
                {subs.map((sub, i) => {
                    const daysLeft = calculateDaysLeft(sub.nextBillingDate);
                    return (
                        <div key={sub._id || i} className="group relative p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/30 transition-all overflow-hidden">
                            {/* Background Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full">
                                <div
                                    className={`h-full transition-all duration-1000 ${daysLeft <= 3 ? "bg-rose-500" : "bg-emerald-500"}`}
                                    style={{ width: `${getProgress(daysLeft)}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-900 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
                                        {sub.name ? sub.name.substring(0, 2).toUpperCase() : '??'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-yellow-400 transition-colors">{sub.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span>฿{sub.amount.toLocaleString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                            <span>{sub.billingCycle === 'MONTHLY' ? 'Mo' : 'Yr'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`text-xs font-bold ${daysLeft <= 3 ? "text-rose-400" : "text-emerald-400"}`}>
                                        {daysLeft} days left
                                    </p>
                                    <p className="text-[10px] text-zinc-600 mt-1">
                                        Due {new Date(sub.nextBillingDate).getDate()}th
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(sub._id, sub.name)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 rounded-full text-zinc-500 hover:text-rose-500 transition-all z-20"
                            >
                                <Trash className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

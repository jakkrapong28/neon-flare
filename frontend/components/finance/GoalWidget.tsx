"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash, Target, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Goal {
    _id: string;
    name: string;
    type: "SAVING" | "DEBT";
    targetAmount: number;
    currentAmount: number;
    color: string;
}

export function GoalWidget() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form
    const [name, setName] = useState("");
    const [type, setType] = useState<"SAVING" | "DEBT">("SAVING");
    const [target, setTarget] = useState("");
    const [current, setCurrent] = useState("");

    const fetchGoals = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:3005/api/finance/goals", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGoals(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleAdd = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            await axios.post("http://localhost:3005/api/finance/goals", {
                name,
                type,
                targetAmount: parseFloat(target),
                currentAmount: parseFloat(current) || 0,
                color: type === 'SAVING' ? '#10b981' : '#f43f5e'
            }, { headers: { Authorization: `Bearer ${token}` } });
            setIsAddOpen(false);
            fetchGoals();
            setName(""); setTarget(""); setCurrent("");
        } catch (e) { alert("Failed to add goal"); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this goal?")) return;
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
            await axios.delete(`http://localhost:3005/api/finance/goals/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGoals();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="bg-zinc-950/80 rounded-xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-500" />
                    Goals & Debt
                </h3>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <button className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-colors border border-yellow-500/20">
                            <Plus className="w-4 h-4" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="text-white">Set Financial Goal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                            <Input placeholder="Goal Name (e.g. Japan Trip)" className="bg-zinc-900 border-zinc-800" value={name} onChange={(e: any) => setName(e.target.value)} />
                            <Select value={type} onValueChange={(v: "SAVING" | "DEBT") => setType(v)}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="SAVING">Savings Goal (Jars)</SelectItem>
                                    <SelectItem value="DEBT">Debt Payoff (Snowball)</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Input type="number" placeholder="Target Amount" className="bg-zinc-900 border-zinc-800" value={target} onChange={(e: any) => setTarget(e.target.value)} />
                                <Input type="number" placeholder="Current Saved/Paid" className="bg-zinc-900 border-zinc-800" value={current} onChange={(e: any) => setCurrent(e.target.value)} />
                            </div>
                            <button onClick={handleAdd} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-md">Create Goal</button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {goals.length === 0 && (
                    <div className="text-center text-zinc-500 text-sm py-4 border-2 border-dashed border-zinc-800 rounded-xl">
                        No active goals.
                    </div>
                )}
                {goals.map((goal) => {
                    const progress = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
                    const isDebt = goal.type === 'DEBT';

                    return (
                        <div key={goal._id} className="group relative p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/30 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDebt ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {isDebt ? 'DEBT' : 'SAVING'}
                                </span>
                                <button onClick={() => handleDelete(goal._id)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-500 transition-opacity">
                                    <Trash className="w-3 h-3" />
                                </button>
                            </div>

                            <h4 className="font-bold text-white mb-1">{goal.name}</h4>

                            <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                <span>฿{goal.currentAmount.toLocaleString()}</span>
                                <span>of ฿{goal.targetAmount.toLocaleString()}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${isDebt ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="text-right text-[10px] text-zinc-500 mt-1">{progress.toFixed(1)}% Complete</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

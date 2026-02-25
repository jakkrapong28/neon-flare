"use client";

import { useState } from "react";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { Button } from "@/components/ui/button";
import { Tags, Plus, X } from "lucide-react";

export default function CategoriesPage() {
    const { data, mounted, addCategory, removeCategory } = useFinanceSystem();
    const [newCat, setNewCat] = useState('');

    if (!mounted) return <div className="p-10 text-center text-zinc-500">Loading Categories...</div>;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCat) {
            addCategory(newCat);
            setNewCat('');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-0">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <Tags className="w-8 h-8 text-violet-500" />
                    หมวดหมู่ (Categories)
                </h1>
                <p className="text-zinc-400">จัดการหมวดหมู่สำหรับบันทึกรายรับ-รายจ่าย</p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                    <input
                        autoFocus
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white outline-none focus:border-violet-500 transition-colors"
                        placeholder="ชื่อหมวดหมู่ใหม่ (e.g. สัตว์เลี้ยง, บริจาค)"
                        value={newCat}
                        onChange={e => setNewCat(e.target.value)}
                    />
                    <Button type="submit" className="bg-violet-600 hover:bg-violet-500 h-auto px-8 rounded-xl font-bold">
                        <Plus className="w-5 h-5 mr-2" /> เพิ่ม
                    </Button>
                </form>

                <div className="flex flex-wrap gap-3">
                    {data.categories.map(cat => (
                        <div key={cat} className="group flex items-center gap-2 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-violet-500/50 transition-all">
                            <span className="font-bold text-zinc-200">{cat}</span>
                            <button
                                onClick={() => {
                                    if (confirm(`ลบหมวดหมู่ "${cat}"?`)) removeCategory(cat);
                                }}
                                className="text-zinc-600 hover:text-rose-500 p-1 opacity-50 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

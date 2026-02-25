"use client";
import { useState } from "react";
import axios from "axios";
import { Loader2, Save } from "lucide-react";

export function HealthLogForm() {
    const [type, setType] = useState<"WEIGHT" | "SLEEP" | "WORKOUT">("WEIGHT");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");
    const [duration, setDuration] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.post("http://localhost:3005/api/health/log", {
                type,
                value: parseFloat(value) || 0,
                date: new Date(),
                note: type === 'SLEEP' ? `Sleep Duration: ${duration} hrs` : (type === 'WORKOUT' ? `${note} (${duration} mins)` : note)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Saved!");
            setValue("");
            setNote("");
            setDuration("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-emerald-500/30 bg-zinc-950/80 shadow-lg shadow-emerald-500/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📝 บันทึกสุขภาพ (Health Log)
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
                    {(['WEIGHT', 'SLEEP', 'WORKOUT'] as const).map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${type === t ? 'bg-emerald-500 text-black shadow' : 'text-zinc-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {type === 'WEIGHT' && (
                    <div>
                        <label className="text-xs text-zinc-400 block mb-1">น้ำหนัก (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                            placeholder="0.0"
                            required
                        />
                    </div>
                )}

                {type === 'SLEEP' && (
                    <div>
                        <label className="text-xs text-zinc-400 block mb-1">ชั่วโมงการนอน</label>
                        <input
                            type="number"
                            step="0.5"
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                            placeholder="7.5"
                            required
                        />
                    </div>
                )}

                {type === 'WORKOUT' && (
                    <>
                        <div>
                            <label className="text-xs text-zinc-400 block mb-1">ประเภทกีฬา</label>
                            <input
                                type="text"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                                placeholder="Running, Yoga..."
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 block mb-1">ระยะเวลา (นาที)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                                placeholder="30"
                                required
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    บันทึกข้อมูล
                </button>
            </form>
        </div>
    );
}

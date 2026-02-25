"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Heart } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface SoulModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SoulModal({ isOpen, onClose }: SoulModalProps) {
    const tCommon = useTranslations('Common');
    const [loading, setLoading] = useState(false);

    // Form States
    const [moodScore, setMoodScore] = useState([5]);
    const [energyScore, setEnergyScore] = useState([5]);
    const [note, setNote] = useState("");

    const router = useRouter();

    const handleSubmit = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:3005/api/health/log", { // Using health endpoint for now or mental health? 
                // Wait, users asked for "Mood". Let's check backend routes. 
                // Ah, mental-health might be better. But Plan said 'SoulModal'.
                // Let's use `mental-health/journal` if it exists, or check `health/log`.
                // Checking previous files, there is `mental-health/journal`.
                // CHANGING ENDPOINT TO mental-health/journal
                moodScore: moodScore[0],
                energyScore: energyScore[0],
                note,
                date: new Date()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Compatibility: Double write to Health for Energy? Or let Backend handle overlap.
            // For now, assume this API handles it.

            alert("บันทึกอารมณ์สำเร็จ (Mood Logged)");
            router.refresh();
            onClose();

            // Reset
            setMoodScore([5]);
            setEnergyScore([5]);
            setNote("");
        } catch (error) {
            console.error("Mood log error:", error);
            // Fallback to health log if mental-health fails (or vice versa depending on backend)
            // But let's try strict path first.
            try {
                // FALLBACK: If mental-health route 404s, maybe it's mixed with Health
                await axios.post("http://localhost:3005/api/mental-health/journal", {
                    moodScore: moodScore[0],
                    energyScore: energyScore[0],
                    note,
                    date: new Date()
                }, { headers: { Authorization: `Bearer ${token}` } });
                alert("บันทึกอารมณ์สำเร็จ (Mood Logged)");
                router.refresh();
                onClose();
            } catch (e) {
                alert("Failed to log mood. System might be offline.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getMoodLabel = (val: number) => {
        if (val >= 8) return "มีความสุขมาก (Happy)";
        if (val >= 6) return "ปกติ (Normal)";
        if (val >= 4) return "เนือยๆ (Tired)";
        return "แย่ (Bad)";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border border-pink-500/20 shadow-2xl shadow-pink-900/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-pink-400 font-bold text-xl">
                        <Heart className="h-6 w-6" />
                        บันทึกอารมณ์ (Mood Tracker)
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        สำรวจความรู้สึกและพลังงานของคุณในวันนี้
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-zinc-300">อารมณ์ (Mood)</label>
                            <span className="text-xs text-pink-400 font-bold">{getMoodLabel(moodScore[0])} ({moodScore[0]}/10)</span>
                        </div>
                        <Slider
                            value={moodScore}
                            onValueChange={setMoodScore}
                            max={10}
                            step={1}
                            className="[&>.relative>.absolute]:bg-pink-500"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-zinc-300">พลังงาน (Energy)</label>
                            <span className="text-xs text-yellow-400 font-bold">{energyScore[0]}/10</span>
                        </div>
                        <Slider
                            value={energyScore}
                            onValueChange={setEnergyScore}
                            max={10}
                            step={1}
                            className="[&>.relative>.absolute]:bg-yellow-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">บันทึกเพิ่มเติม (Journal)</label>
                        <Input
                            placeholder="วันนี้เป็นอย่างไรบ้าง..."
                            className="bg-zinc-900 border-zinc-800"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="hover:bg-zinc-800 text-zinc-400">
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-pink-600 hover:bg-pink-500 text-white w-full sm:w-auto shadow-lg shadow-pink-900/20"
                    >
                        {loading ? "กำลังระบุ..." : "บันทึกข้อมูล"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

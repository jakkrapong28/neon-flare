"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface WorkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WorkModal({ isOpen, onClose }: WorkModalProps) {
    const t = useTranslations('Work'); // Assuming 'Work' ns exists or will fallback
    const tCommon = useTranslations('Common');
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");

    const router = useRouter();

    const handleSubmit = async () => {
        if (!title) {
            alert(tCommon('error'));
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:3005/api/productivity/tasks", {
                title,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status: "TODO"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("เพิ่มงานสำเร็จ (Task Added)");
            router.refresh();
            onClose();

            // Reset
            setTitle("");
            setPriority("medium");
            setDueDate("");
        } catch (error) {
            console.error("Task add error:", error);
            alert(tCommon('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border border-violet-500/20 shadow-2xl shadow-violet-900/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-violet-400 font-bold text-xl">
                        <CheckSquare className="h-6 w-6" />
                        เพิ่มงานใหม่ (Add Task)
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        จดบันทึกงานที่ต้องทำเพื่อให้ชีวิตเป็นระเบียบ
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">ชื่องาน (Title)</label>
                        <Input
                            placeholder="เช่น ซื้อของเข้าตู้เย็น, ส่งงานลูกค้า"
                            className="bg-zinc-900 border-zinc-800"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">ความสำคัญ (Priority)</label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="urgent" className="text-rose-400 font-bold">ด่วนที่สุด (Urgent)</SelectItem>
                                    <SelectItem value="high" className="text-orange-400">สูง (High)</SelectItem>
                                    <SelectItem value="medium" className="text-yellow-400">ปานกลาง (Medium)</SelectItem>
                                    <SelectItem value="low" className="text-emerald-400">ต่ำ (Low)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">กำหนดส่ง (Due Date)</label>
                            <Input
                                type="datetime-local"
                                className="bg-zinc-900 border-zinc-800"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="hover:bg-zinc-800 text-zinc-400">
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-violet-600 hover:bg-violet-500 text-white w-full sm:w-auto shadow-lg shadow-violet-900/20"
                    >
                        {loading ? "กำลังบันทึก..." : "เพิ่มงาน"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

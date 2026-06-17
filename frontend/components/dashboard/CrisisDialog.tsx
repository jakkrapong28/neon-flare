"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Wallet, Briefcase, Zap, AlertTriangle, CheckCircle2, Wind, BookOpen } from "lucide-react"

// Mock Data for Work
const MOCK_TASKS = [
    { id: '1', title: 'สรุปงบประมาณไตรมาส 1' },
    { id: '2', title: 'เตรียมสไลด์สำหรับลูกค้า VIP' },
    { id: '3', title: 'รีวิว Performance ทีม' },
]

interface CrisisDialogProps {
    mode: string | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export function CrisisDialog({ mode, isOpen, onClose, onConfirm }: CrisisDialogProps) {
    const [formData, setFormData] = useState<any>({});
    const [step, setStep] = useState(1); // 1 = Input, 2 = AI Processing/Result (Handled by parent for now, but UI here)

    if (!mode) return null;

    const handleConfirm = () => {
        onConfirm(formData);
        onClose();
        // Reset form
        setFormData({});
        setStep(1);
    };

    const renderContent = () => {
        switch (mode) {
            case 'money':
                return (
                    <div className="grid gap-4 py-4 text-foreground">
                        <div className="grid gap-2">
                            <label htmlFor="amount" className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
                                ยอดเงินที่ต้องการ (บาท)
                            </label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="เช่น 50,000"
                                className="col-span-3 bg-muted border-border text-foreground focus:border-primary focus:ring-primary/20 placeholder-zinc-400 rounded-xl"
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="date" className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
                                วันที่ต้องใช้
                            </label>
                            <Input
                                id="date"
                                type="date"
                                className="col-span-3 bg-muted border-border text-foreground focus:border-primary focus:ring-primary/20 rounded-xl"
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>
                );
            case 'work':
                return (
                    <div className="grid gap-4 py-4 text-foreground">
                        <p className="text-xs text-muted-foreground font-medium mb-2">เลือก 1 งานที่ "ต้องเสร็จ" วันนี้ (งานอื่นจะถูกเลื่อนออกไป)</p>
                        <div className="space-y-2">
                            {MOCK_TASKS.map((task) => (
                                <div key={task.id} className="flex items-center space-x-3 border border-border bg-muted/40 p-3 rounded-xl hover:border-zinc-300 transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, taskId: task.id })}>
                                    <div className={`w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center ${formData.taskId === task.id ? 'bg-primary border-primary' : 'bg-transparent'}`}>
                                        {formData.taskId === task.id && <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground stroke-[3px]" />}
                                    </div>
                                    <span className="text-sm font-bold text-foreground">{task.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'burnout':
                return (
                    <div className="grid grid-cols-2 gap-4 py-6">
                        <Button
                            variant="outline"
                            className="h-32 flex flex-col gap-3 bg-muted/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all cursor-pointer text-foreground rounded-xl"
                            onClick={() => handleConfirm()} // Direct action
                        >
                            <Wind className="w-8 h-8 text-pink-600" />
                            <span className="font-extrabold text-md">ฝึกหายใจ</span>
                            <span className="text-[10px] text-muted-foreground">3 นาทีเพื่อสงบจิตใจ</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-32 flex flex-col gap-3 bg-muted/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all cursor-pointer text-foreground rounded-xl"
                            onClick={() => handleConfirm()} // Direct action
                        >
                            <BookOpen className="w-8 h-8 text-cyan-600" />
                            <span className="font-extrabold text-md">ระบายความเครียด</span>
                            <span className="text-[10px] text-muted-foreground">เขียน Journal สั้นๆ</span>
                        </Button>
                    </div>
                );
            case 'urgent':
                return (
                    <div className="grid gap-4 py-4 text-foreground">
                        <div className="grid gap-2">
                            <label htmlFor="brain-dump" className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
                                เกิดอะไรขึ้น? (เล่าสั้นๆ)
                            </label>
                            <textarea
                                id="brain-dump"
                                className="flex min-h-[120px] w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder-zinc-400 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                                placeholder="พิมพ์ระบาย หรือบอกปัญหาตรงนี้..."
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (mode) {
            case 'money': return 'เสริมสภาพคล่อง (Money)';
            case 'work': return 'จัดการงานล้นมือ (Overload)';
            case 'burnout': return 'เติมไฟ / พักใจ (Recharge)';
            case 'urgent': return 'รับมือเรื่องด่วน (Urgent)';
            default: return 'Crisis Mode';
        }
    };

    const getActionLabel = () => {
        switch (mode) {
            case 'money': return 'วิเคราะห์ทางออก';
            case 'work': return 'เคลียร์งานอื่นออกไปก่อน';
            case 'burnout': return null; // Actions are buttons themselves
            case 'urgent': return 'บันทึกและหาทางออก';
            default: return 'ตกลง';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-card text-foreground border border-border shadow-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 font-mono uppercase">
                        {mode === 'money' && <Wallet className="w-5 h-5 text-cyan-600" />}
                        {mode === 'work' && <Briefcase className="w-5 h-5 text-pink-600" />}
                        {mode === 'burnout' && <Zap className="w-5 h-5 text-green-600" />}
                        {mode === 'urgent' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground font-medium">
                        {mode === 'burnout' ? 'เลือกวิธีดูแลตัวเองที่คุณต้องการตอนนี้' : 'ระบบจะช่วยวิเคราะห์และวางแผนให้คุณทันที'}
                    </DialogDescription>
                </DialogHeader>

                {renderContent()}

                {mode !== 'burnout' && (
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer rounded-xl">ยกเลิก</Button>
                        <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer rounded-xl font-bold">
                            {getActionLabel()}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

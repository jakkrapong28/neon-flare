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
import { Textarea } from "@/components/ui/textarea" // Assuming generic or HTML
import { Label } from "@/components/ui/label" // Assuming generic or HTML
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Assuming generic or HTML
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
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-700">
                                ยอดเงินที่ต้องการ (บาท)
                            </label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="เช่น 50,000"
                                className="col-span-3 border-emerald-200 focus:ring-emerald-500"
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-700">
                                วันที่ต้องใช้
                            </label>
                            <Input
                                id="date"
                                type="date"
                                className="col-span-3"
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>
                );
            case 'work':
                return (
                    <div className="grid gap-4 py-4">
                        <p className="text-sm text-muted-foreground mb-2">เลือก 1 งานที่ "ต้องเสร็จ" วันนี้ (งานอื่นจะถูกเลื่อนออกไป)</p>
                        <div className="space-y-2">
                            {MOCK_TASKS.map((task) => (
                                <div key={task.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, taskId: task.id })}>
                                    <div className={`w-5 h-5 rounded-full border border-primary flex items-center justify-center ${formData.taskId === task.id ? 'bg-primary' : 'bg-transparent'}`}>
                                        {formData.taskId === task.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm font-medium">{task.title}</span>
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
                            className="h-32 flex flex-col gap-3 hover:border-orange-500 hover:bg-orange-50 transition-all"
                            onClick={() => handleConfirm()} // Direct action
                        >
                            <Wind className="w-8 h-8 text-orange-500" />
                            <span className="font-bold text-lg">ฝึกหายใจ</span>
                            <span className="text-xs text-muted-foreground">3 นาทีเพื่อสงบจิตใจ</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-32 flex flex-col gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
                            onClick={() => handleConfirm()} // Direct action
                        >
                            <BookOpen className="w-8 h-8 text-blue-500" />
                            <span className="font-bold text-lg">ระบายความเครียด</span>
                            <span className="text-xs text-muted-foreground">เขียน Journal สั้นๆ</span>
                        </Button>
                    </div>
                );
            case 'urgent':
                return (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="brain-dump" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-700">
                                เกิดอะไรขึ้น? (เล่าสั้นๆ)
                            </label>
                            <textarea
                                id="brain-dump"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <DialogContent className="sm:max-w-[425px] bg-white text-zinc-900 border-zinc-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {mode === 'money' && <Wallet className="w-6 h-6 text-emerald-600" />}
                        {mode === 'work' && <Briefcase className="w-6 h-6 text-blue-600" />}
                        {mode === 'burnout' && <Zap className="w-6 h-6 text-orange-500" />}
                        {mode === 'urgent' && <AlertTriangle className="w-6 h-6 text-rose-600" />}
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        {mode === 'burnout' ? 'เลือกวิธีดูแลตัวเองที่คุณต้องการตอนนี้' : 'ระบบจะช่วยวิเคราะห์และวางแผนให้คุณทันที'}
                    </DialogDescription>
                </DialogHeader>

                {renderContent()}

                {mode !== 'burnout' && (
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} className="border-zinc-300 text-zinc-700 hover:bg-zinc-100">ยกเลิก</Button>
                        <Button onClick={handleConfirm} className="bg-zinc-900 text-white hover:bg-zinc-800">
                            {getActionLabel()}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

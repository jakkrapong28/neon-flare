"use client";

import { useState } from "react";
import { financeStore } from "@/lib/financeStore";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ScanPage() {
    const router = useRouter();
    const [step, setStep] = useState<'UPLOAD' | 'SCANNING' | 'REVIEW'>('UPLOAD');
    const [preview, setPreview] = useState<string | null>(null);
    const [scannedData, setScannedData] = useState({
        amount: 0,
        date: '',
        merchant: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Simulate Scanning
        setStep('SCANNING');
        setTimeout(() => {
            // Mock OCR Result
            setScannedData({
                amount: Math.floor(Math.random() * 1000) + 50,
                date: new Date().toISOString().split('T')[0],
                merchant: '7-Eleven Included VAT'
            });
            setStep('REVIEW');
        }, 2500);
    };

    const handleSave = () => {
        financeStore.addTransaction({
            type: 'EXPENSE',
            amount: scannedData.amount,
            category: 'Food', // Default guess
            date: scannedData.date,
            note: `Scan: ${scannedData.merchant}`
        });
        router.push('/finance');
    };

    return (
        <div className="max-w-md mx-auto py-10">
            <h1 className="text-2xl font-black text-white text-center mb-8">สแกนสลิป (AI Scan)</h1>

            {step === 'UPLOAD' && (
                <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-10 text-center hover:bg-zinc-900/50 transition-colors relative cursor-pointer group">
                    <input
                        type="file" accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-zinc-500 group-hover:text-amber-500" />
                    </div>
                    <p className="font-bold text-white">อัปโหลดรูปภาพสลิป</p>
                    <p className="text-xs text-zinc-500 mt-2">รองรับ JPG, PNG (Max 5MB)</p>
                </div>
            )}

            {step === 'SCANNING' && (
                <div className="text-center py-20">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-amber-500 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-white animate-pulse">กำลังประมวลผล...</h2>
                    <p className="text-zinc-500 text-sm mt-2">AI กำลังอ่านยอดเงินและร้านค้า</p>
                </div>
            )}

            {step === 'REVIEW' && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-900">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="font-bold text-emerald-500">อ่านข้อมูลสำเร็จ!</p>
                            <p className="text-xs text-zinc-500">โปรดตรวจสอบความถูกต้อง</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-zinc-500">ยอดเงิน (Amount)</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-2xl font-bold text-white outline-none focus:border-amber-500"
                                value={scannedData.amount}
                                onChange={e => setScannedData({ ...scannedData, amount: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500">ร้านค้า (Merchant)</label>
                            <input
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                                value={scannedData.merchant}
                                onChange={e => setScannedData({ ...scannedData, merchant: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500">วันที่ (Date)</label>
                            <input
                                type="date"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                                value={scannedData.date}
                                onChange={e => setScannedData({ ...scannedData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Button variant="outline" onClick={() => setStep('UPLOAD')} className="flex-1 rounded-xl border-zinc-800 text-zinc-400">
                            ยกเลิก
                        </Button>
                        <Button onClick={handleSave} className="flex-1 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400">
                            บันทึกรายการ
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Check, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function SlipUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null); // Reset prev result
            // Auto upload? Let's wait for user to click Scan for better UX/Control
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        // Toast/Alert simulation (In a real app, use a proper Toast component)
        const loadingToast = document.createElement("div");
        loadingToast.innerText = "กำลังอ่านสลิป... (Reading Slip)";
        loadingToast.className = "fixed bottom-4 right-4 bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2";
        document.body.appendChild(loadingToast);

        try {
            // SIMULATION: Mock AI Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock Data Result
            const mockResult = {
                merchant: "7-Eleven",
                amount: 150,
                category: "FOOD",
                date: new Date().toISOString(),
                note: "ซื้อของใช้ (Groceries)"
            };

            setResult(mockResult);

            // Cleanup Toast
            if (document.body.contains(loadingToast)) document.body.removeChild(loadingToast);

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
            if (document.body.contains(loadingToast)) document.body.removeChild(loadingToast);
        } finally {
            setUploading(false);
        }
    };

    const confirmTransaction = async () => {
        if (!result) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.post("http://localhost:3005/api/finance/transactions", {
                amount: result.amount || 0,
                category: result.category || 'Uncategorized',
                date: result.date ? new Date(result.date) : new Date(),
                merchant: result.merchant || 'Unknown',
                note: result.note || 'Slip Scan',
                type: 'EXPENSE'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("บันทึกสำเร็จ! (Saved Successfully)");
            setFile(null);
            setResult(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            window.location.reload(); // Quick refresh to show data
        } catch (e) {
            console.error("Save failed", e);
            alert("Failed to save transaction.");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {!result ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-yellow-500/50 hover:bg-zinc-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                    <div className="p-4 rounded-full bg-zinc-800 group-hover:bg-yellow-500/20 mb-3 transition-colors">
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-yellow-500" />
                    </div>
                    <p className="text-sm font-medium text-zinc-300">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                    <p className="text-xs text-zinc-500 mt-1">รองรับ JPG, PNG (Max 5MB)</p>
                    {file && (
                        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm border border-emerald-500/20">
                            <FileText className="w-4 h-4" />
                            {file.name}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-zinc-900/80 rounded-xl p-4 border border-emerald-500/30 shadow-lg shadow-emerald-900/10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">MERCHANT</p>
                            <h4 className="text-lg font-bold text-white">{result.merchant || "Unknown"}</h4>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">TOTAL</p>
                            <h4 className="text-xl font-black text-rose-500">-฿{(result.amount || 0).toLocaleString()}</h4>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-zinc-400 mb-6 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                        <div>
                            <span className="text-xs text-zinc-600 block mb-0.5">DATE</span>
                            <span className="text-zinc-200 font-mono">{result.date ? new Date(result.date).toLocaleDateString('th-TH') : "Today"}</span>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-600 block mb-0.5">CATEGORY</span>
                            <span className="text-amber-400 font-bold uppercase">{result.category || "Uncategorized"}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={confirmTransaction} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-lg shadow-emerald-500/20">
                            <Check className="w-4 h-4 mr-2" /> ยืนยัน (Confirm)
                        </Button>
                        <Button onClick={() => { setResult(null); setFile(null); }} variant="outline" className="flex-1 border-zinc-700 hover:bg-zinc-800 text-zinc-400">
                            <RefreshCw className="w-4 h-4 mr-2" /> เริ่มใหม่
                        </Button>
                    </div>
                </div>
            )}

            {!result && file && (
                <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/20"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploading ? "กำลังวิเคราะห์..." : "เริ่มสแกน (Start Scan)"}
                </Button>
            )}
        </div>
    );
}

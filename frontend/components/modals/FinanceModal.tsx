"use client";
import { useFinanceSystem } from "@/hooks/useFinanceSystem";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Upload } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface FinanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultType?: "income" | "expense";
}

export function FinanceModal({ isOpen, onClose, defaultType = "expense" }: FinanceModalProps) {
    const t = useTranslations('Finance');
    const tCommon = useTranslations('Common');
    const { addTransaction, addDebt, data } = useFinanceSystem(); // Use Hook

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("manual");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form States
    const [amount, setAmount] = useState("");
    const [type, setType] = useState(defaultType); // Use prop
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    // Debt Specific States
    const [isDebtMode, setIsDebtMode] = useState(false);
    const [debtAction, setDebtAction] = useState<'create' | 'repay'>('repay');
    const [debtTenure, setDebtTenure] = useState("12");

    // Effect to update type when prop changes (if modal re-opens)
    useEffect(() => {
        setType(defaultType);
    }, [defaultType, isOpen]);

    // Effect to check category
    useEffect(() => {
        if (category.toLowerCase().includes('debt') || category.toLowerCase().includes('หนี้') || category.toLowerCase().includes('loan')) {
            setIsDebtMode(true);
        } else {
            setIsDebtMode(false);
        }
    }, [category]);

    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
            alert(tCommon('error'));
            router.push("/login");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("http://localhost:3005/api/finance/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;
            if (data.error) {
                alert("ระบบ AI ไม่สามารถอ่านสลิปได้ชัดเจน");
            } else {
                setAmount(data.amount?.toString() || "");
                if (data.category) setCategory(data.category.toLowerCase());
                setNote(data.note || `สลิปโอนเงิน ${data.merchant || "ไม่ทราบชื่อ"}`);
                // TODO: Handle Date if needed
                setActiveTab("manual");
                alert("สแกนสลิปสำเร็จ!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("ไม่สามารถอัปโหลดสลิปได้");
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSubmit = async () => {
        if (!amount || !category) {
            alert(tCommon('error'));
            return;
        }

        const token = localStorage.getItem("authToken");

        setLoading(true);
        try {
            const numericAmount = parseFloat(amount);

            // SPECIAL LOGIC FOR DEBT
            if (isDebtMode && debtAction === 'create') {
                // Creating NEW DEBT -> NOT an Expense. It's a Liability.
                await addDebt({
                    name: note || "New Debt",
                    amount: numericAmount,
                    remainingAmount: numericAmount,
                    interestRate: 0, // Default for quick add
                    minPayment: 0,
                    dueDate: 1,
                    totalMonths: parseInt(debtTenure) || 12,
                });
                alert("สร้างรายการหนี้ใหม่เรียบร้อย (Created Liability)");
            } else {
                // Regular Expense or Income OR Debt Repayment
                const payload = {
                    amount: numericAmount,
                    type: type.toUpperCase() as 'INCOME' | 'EXPENSE',
                    category,
                    note: isDebtMode && debtAction === 'repay' ? `Repayment: ${note}` : note,
                    date: new Date().toISOString(),
                };

                await addTransaction({
                    type: payload.type,
                    amount: payload.amount,
                    category: payload.category,
                    date: payload.date,
                    note: payload.note
                });

                alert(tCommon('save') + " " + tCommon('confirm'));
            }

            // router.refresh(); 
            onClose();

            // Reset form
            setAmount("");
            setCategory("");
            setNote("");
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("authToken");
                alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
                router.push("/login");
            } else {
                alert(tCommon('error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border border-yellow-500/20 shadow-2xl shadow-yellow-900/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-500 font-bold text-xl">
                        <Wallet className="h-6 w-6" />
                        บันทึกรายการ (Add Transaction)
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        เลือกวิธีบันทึกรายการรายรับ-รายจ่ายของคุณ
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 p-1">
                        <TabsTrigger value="manual" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold">บันทึกเอง (Manual)</TabsTrigger>
                        <TabsTrigger value="scan" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold">สแกนสลิป (AI Scan)</TabsTrigger>
                    </TabsList>

                    {/* Manual Input Tab */}
                    <TabsContent value="manual" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">{t('type')}</label>
                                <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="expense">{t('expense')}</SelectItem>
                                        <SelectItem value="income">{t('income')}</SelectItem>
                                        <SelectItem value="invest">{t('invest')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">{t('amount')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-zinc-500">฿</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-8 bg-zinc-900 border-zinc-800 font-mono text-lg"
                                        autoFocus
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">{t('category')}</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder={t('category') + "..."} />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {/* Dynamic Categories */}
                                    {data.categories.map((cat) => (
                                        <SelectItem key={cat} value={cat.toLowerCase()}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* DEBT SPECIAL LOGIC UI */}
                        {isDebtMode && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={debtAction === 'repay' ? 'default' : 'outline'}
                                        onClick={() => setDebtAction('repay')}
                                        className={debtAction === 'repay' ? "bg-emerald-600 hover:bg-emerald-500 text-white flex-1" : "flex-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"}
                                    >
                                        จ่ายหนี้ (Repay)
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={debtAction === 'create' ? 'default' : 'outline'}
                                        onClick={() => setDebtAction('create')}
                                        className={debtAction === 'create' ? "bg-rose-600 hover:bg-rose-500 text-white flex-1" : "flex-1 border-rose-500/30 text-rose-500 hover:bg-rose-500/10"}
                                    >
                                        สร้างหนี้ (New Loan)
                                    </Button>
                                </div>

                                {debtAction === 'create' && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-rose-400 font-bold">ระยะเวลาผ่อน (เดือน)</label>
                                        <Input
                                            type="number"
                                            value={debtTenure}
                                            onChange={e => setDebtTenure(e.target.value)}
                                            className="bg-black/50 border-rose-500/30 text-white"
                                            placeholder="12"
                                        />
                                        <p className="text-[10px] text-zinc-500">
                                            ยอดหนี้ {amount || '0'} บาท จะไม่ถูกคิดเป็น "รายจ่าย" แต่จะไปโผล่ในหน้า "Debt"
                                        </p>
                                    </div>
                                )}
                                {debtAction === 'repay' && (
                                    <p className="text-[10px] text-emerald-400">
                                        ยอดนี้จะถูกบันทึกเป็น "รายจ่าย" และคุณควรไปตัดยอดหนี้ในหน้า Debt ด้วยตนเอง (ถ้าต้องการความละเอียด)
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">{t('note')}</label>
                            <Input
                                placeholder={t('placeholder_note')}
                                className="bg-zinc-900 border-zinc-800"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                    </TabsContent>

                    {/* Scan Slip Tab */}
                    <TabsContent value="scan" className="py-4">
                        <div
                            className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-900/30"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <Upload className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-medium text-white mb-1">{t('drag_drop_slip')}</h4>
                            <p className="text-sm text-zinc-500 mb-4">{t('support_file')}</p>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                {loading ? tCommon('loading') : t('choose_image')}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="hover:bg-zinc-800 text-zinc-400">
                        {tCommon('cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto shadow-lg shadow-emerald-900/20"
                    >
                        {loading ? tCommon('loading') : tCommon('confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}

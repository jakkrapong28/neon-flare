"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Construction, ArrowLeft } from "lucide-react";

export default function ComingSoonPage() {
    const pathname = usePathname();
    const section = pathname.split('/')[1] || "Feature";
    // Map section to Thai name
    const sectionNameMap: Record<string, string> = {
        finance: "การเงิน (Finance)",
        work: "การงาน (Work)",
        health: "สุขภาพ (Health)",
        soul: "จิตใจ (Mental)",
        knowledge: "ความรู้ (Knowledge)",
        settings: "ตั้งค่า (Settings)"
    };

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
            <div className="p-6 bg-zinc-900/50 rounded-full border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                <Construction className="w-16 h-16 text-yellow-500 animate-pulse" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black text-foreground">กำลังพัฒนาฟีเจอร์นี้</h1>
                <h2 className="text-xl font-bold text-amber-500">{sectionNameMap[section] || section}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    เรากำลังมุ่งมั่นพัฒนา "{pathname}" ให้สมบูรณ์แบบที่สุด<br />
                    เพื่อให้คุณได้สัมผัสประสบการณ์ Luxury LifeOS อย่างเต็มรูปแบบ
                </p>
            </div>

            <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all border border-zinc-800 hover:border-yellow-500/50 shadow-lg"
            >
                <ArrowLeft className="w-4 h-4" />
                กลับหน้าหลัก (Back to Dashboard)
            </Link>
        </div>
    );
}

"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Heart, Settings, Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrivacyToggle } from "@/components/ui/PrivacyToggle";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function AppSidebar() {
    const pathname = usePathname();
    const t = useTranslations('Sidebar');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const menu = [
        { name: t('work'), href: "/", icon: Zap },
        { name: t('finance'), href: "/vault", icon: Wallet },
        { name: t('soul'), href: "/calm", icon: Heart },
    ];

    return (
        <div className="flex flex-col h-screen w-72 bg-card border-r border-border text-foreground shrink-0 shadow-sm overflow-y-auto font-sans relative z-30">
            <div className="p-6 mb-2 flex flex-col gap-6 sticky top-0 bg-card/80 backdrop-blur-md z-10 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                        <span className="text-xl font-black text-primary-foreground">N</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-foreground">
                            NEON FLARE
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase font-mono">Cybernetic LifeOS</span>
                    </div>
                </div>

                {/* Quick Action Button - Sidebar Integrated */}
                <button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-quick-action'));
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl border border-transparent transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span>เพิ่มรายการใหม่</span>
                </button>
            </div>


            <nav className="flex-1 space-y-2 px-4 pb-4 mt-4">
                {/* Main Modules */}
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group relative font-medium border",
                                isActive
                                    ? "bg-secondary text-primary font-bold border-border shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent hover:border-border"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-zinc-400 group-hover:text-zinc-600")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-3 p-4 bg-muted/60 border-t border-border">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 bg-card border border-border rounded-xl mb-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {mounted && typeof window !== 'undefined' && localStorage.getItem('user_avatar') ? (
                            <img src={localStorage.getItem('user_avatar')!} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-primary font-bold font-mono">U</span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-foreground truncate">
                            {mounted && typeof window !== 'undefined' ? (localStorage.getItem('user_name') || "User") : "User"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono font-bold tracking-wider truncate uppercase">LEVEL 99 ADMIN</p>
                    </div>
                </div>

                <div className="px-3 py-1">
                    <p className="text-[9px] font-bold text-muted-foreground mb-2 uppercase tracking-widest font-mono">{t('quick_settings')}</p>
                    <PrivacyToggle />
                </div>
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all group border",
                        pathname === "/settings"
                            ? "bg-secondary text-foreground font-medium border-border shadow-sm"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent hover:border-border"
                    )}
                >
                    <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    {t('settings')}
                </Link>
            </div>
        </div>
    );
}

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
        <div className="flex flex-col h-screen w-72 bg-sidebar border-r border-sidebar-border text-sidebar-foreground shrink-0 shadow-sm overflow-y-auto font-sans">
            <div className="p-6 mb-2 flex flex-col gap-6 sticky top-0 bg-sidebar z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md shadow-yellow-500/20 flex items-center justify-center">
                        <span className="text-xl font-black text-white">N</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-foreground">
                            NEON FLARE
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Luxury LifeOS</span>
                    </div>
                </div>

                {/* Quick Action Button - Sidebar Integrated */}
                <button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-quick-action'));
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span>เพิ่มรายการใหม่</span>
                </button>
            </div>


            <nav className="flex-1 space-y-1 px-4 pb-4">
                {/* Main Modules */}
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group relative font-medium",
                                isActive
                                    ? "bg-sidebar-accent text-primary font-bold shadow-sm"
                                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-2 p-4 bg-sidebar border-t border-sidebar-border">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 bg-sidebar-accent rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center overflow-hidden shrink-0">
                        {mounted && typeof window !== 'undefined' && localStorage.getItem('user_avatar') ? (
                            <img src={localStorage.getItem('user_avatar')!} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-muted-foreground font-bold">U</span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-foreground truncate">
                            {mounted && typeof window !== 'undefined' ? (localStorage.getItem('user_name') || "User") : "User"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">สมาชิกระดับสูง</p>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('quick_settings')}</p>
                    <PrivacyToggle />
                </div>
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground group",
                        pathname === "/settings"
                            ? "bg-sidebar-accent text-foreground font-medium shadow-sm border border-sidebar-border"
                            : "text-muted-foreground hover:bg-sidebar-accent"
                    )}
                >
                    <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    {t('settings')}
                </Link>
            </div>
        </div>
    );
}

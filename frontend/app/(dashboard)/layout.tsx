"use client";
import { AppSidebar } from "@/components/AppSidebar";
import { QuickActionFab } from "@/components/layout/QuickActionFab";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return null; // Prevent rendering dashboard while redirecting

    return (
        <div className="flex h-screen w-full overflow-hidden bg-black text-white">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">
                {children}
                <div className="pb-20"></div> {/* Spacing for FAB/Scroll */}
            </main>

            {/* Global Features */}
            <div className="fixed z-50 bottom-0 right-0 pointer-events-none">
                <div className="pointer-events-auto">
                    <QuickActionFab />
                </div>
            </div>
            <GlobalSearch />
        </div>
    );
}

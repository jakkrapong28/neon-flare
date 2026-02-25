"use client";
import { useState, useEffect } from "react";
import { Search, Command, Home, Wallet, Activity, Heart, Calendar, Settings, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const links = [
        { name: "Dashboard", href: "/", icon: Home, category: "Navigation" },
        { name: "Finance", href: "/finance", icon: Wallet, category: "Navigation" },
        { name: "Workstation", href: "/work", icon: Activity, category: "Navigation" },
        { name: "Soul / Wellness", href: "/soul", icon: Heart, category: "Navigation" },
        { name: "Health", href: "/health", icon: Activity, category: "Navigation" },
        { name: "Settings", href: "/settings", icon: Settings, category: "System" },
        { name: "Add Expense", action: "ADD_EXPENSE", icon: Wallet, category: "Quick Action" },
        { name: "Add Income", action: "ADD_INCOME", icon: Wallet, category: "Quick Action" },
        { name: "Export Data", action: "EXPORT", icon: FileText, category: "System" },
    ];

    const filtered = links.filter(link =>
        link.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (link: any) => {
        setIsOpen(false);
        if (link.href) {
            router.push(link.href);
        } else if (link.action === "ADD_EXPENSE") {
            // Dispatch event to open finance modal
            window.dispatchEvent(new CustomEvent("open-finance-modal", { detail: { type: 'expense' } }));
        } else if (link.action === "ADD_INCOME") {
            window.dispatchEvent(new CustomEvent("open-finance-modal", { detail: { type: 'income' } }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
                            <Search className="w-5 h-5 text-zinc-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-zinc-600 h-6"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <div className="text-xs text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded">ESC</div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                            {filtered.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500 text-sm">No results found.</div>
                            ) : (
                                filtered.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(link)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 group transition-colors"
                                    >
                                        <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 rounded-md text-zinc-400 group-hover:text-white transition-colors">
                                            <link.icon className="w-4 h-4" />
                                        </div>
                                        <span className="flex-1 text-left text-sm text-zinc-300 group-hover:text-white">
                                            {link.name}
                                        </span>
                                        <span className="text-xs text-zinc-600">{link.category}</span>
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/30 text-xs text-zinc-500 flex justify-between">
                            <span>Protip: Use arrow keys to navigate</span>
                            <span>Cmd+K to open</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

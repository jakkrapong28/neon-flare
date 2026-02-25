"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PrivacyContextType {
    isPrivacyMode: boolean;
    togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);

    // Optional: Global keyboard shortcut (Cmd+Shift+P) for panic mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "p") {
                setIsPrivacyMode((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const togglePrivacyMode = () => setIsPrivacyMode((prev) => !prev);

    return (
        <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
            <div className={isPrivacyMode ? "privacy-mode-active" : ""}>
                {children}
            </div>
            {/* Optional: Overlay/Indicator */}
            {isPrivacyMode && (
                <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse pointer-events-none">
                    PRIVACY ON
                </div>
            )}
        </PrivacyContext.Provider>
    );
}

export function usePrivacy() {
    const context = useContext(PrivacyContext);
    if (context === undefined) {
        throw new Error("usePrivacy must be used within a PrivacyProvider");
    }
    return context;
}

"use client";
import React from "react";
import { usePrivacy } from "@/context/PrivacyContext";

export function PrivacyBlur({ children, intensity = "md", className = "" }: { children: React.ReactNode, intensity?: "sm" | "md" | "lg", className?: string }) {
    const { isPrivacyMode } = usePrivacy();

    // We return a fragment if not in privacy mode to avoid extra DOM nodes
    // but the blur wrapper needs to be there if we want transition.
    // However, for simple implementation:

    const blurMap = { sm: "blur-sm", md: "blur-md", lg: "blur-lg" };

    return (
        <div className={`transition-all duration-300 ${isPrivacyMode ? blurMap[intensity] + " select-none opacity-50" : ""} ${className}`}>
            {children}
        </div>
    );
}

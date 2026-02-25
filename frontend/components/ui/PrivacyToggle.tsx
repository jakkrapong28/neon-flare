"use client";
import { Eye, EyeOff } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";

export function PrivacyToggle() {
    const { isPrivacyMode, togglePrivacyMode } = usePrivacy();

    return (
        <button
            onClick={togglePrivacyMode}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isPrivacyMode ? 'bg-red-500/20 text-red-500 font-bold' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
        >
            {isPrivacyMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            <span>{isPrivacyMode ? "Panic Info Hidden" : "Privacy Mode"}</span>
        </button>
    );
}

"use client";

import { PrivacyProvider } from "@/context/PrivacyContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
            <PrivacyProvider>
                {children}
            </PrivacyProvider>
        </ThemeProvider>
    );
}

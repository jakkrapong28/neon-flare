"use client";

import { PrivacyProvider } from "@/context/PrivacyContext";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user_name");
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [router]);

    return (
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            <PrivacyProvider>
                {children}
            </PrivacyProvider>
        </ThemeProvider>
    );
}

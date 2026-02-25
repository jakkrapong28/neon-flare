"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", displayName: "Admin" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isRegister ? "http://localhost:3005/api/auth/register" : "http://localhost:3005/api/auth/login";
            const payload = isRegister ? { email: form.email, password: form.password, name: form.displayName } : form;
            const res = await axios.post(endpoint, payload);

            if (isRegister) {
                alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
                setIsRegister(false);
            } else {
                if (res.data.access_token) {
                    localStorage.setItem("authToken", res.data.access_token);
                    // Also store the user's name for the dashboard
                    if (res.data.user?.name) {
                        localStorage.setItem("user_name", res.data.user.name);
                    } else if (res.data.user?.displayName) {
                        localStorage.setItem("user_name", res.data.user.displayName);
                    }
                    router.push("/");
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "รหัสผ่านหรืออีเมลไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background FX */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }}></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
                    {/* Neon Border Effect */}
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800 shadow-lg shadow-purple-500/20">
                            <Lock className="w-6 h-6 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-1">
                            NEON <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">GATEKEEPER</span>
                        </h1>
                        <p className="text-zinc-500 text-sm">{isRegister ? "สร้างตัวตนใหม่ในระบบ" : "ระบบยืนยันตัวตน v2.0"}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegister && (
                            <div className="space-y-2">
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="ชื่อแสดงผล (Display Name)"
                                        value={form.displayName}
                                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="ชื่อผู้ใช้ (อีเมล / Email)"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="รหัสผ่าน (Passcode)"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isRegister ? "ลงทะเบียน" : "เข้าสู่ระบบ"} <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Restricted Area • Auth Req</p>
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
                        >
                            {isRegister ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" : "ผู้ใช้ใหม่? สร้างตัวตน (ลงทะเบียน)"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

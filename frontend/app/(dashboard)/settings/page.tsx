"use client";
import { useState, useEffect } from "react";
import { usePrivacy } from "@/context/PrivacyContext";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFinanceSystem } from "@/hooks/useFinanceSystem"; // Import hook
import { Eye, EyeOff, User, LogOut, Camera, FileText, Moon, Sun, Monitor, RefreshCw } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

function RestoreButton() {
    const { migrateFromLocalStorage } = useFinanceSystem();
    const [loading, setLoading] = useState(false);

    const handleRestore = async () => {
        if (!confirm("ยืนยันกู้คืนข้อมูลเดิมจากเครื่อง? (ข้อมูลปัจจุบันอาจถูกทับ หรือเพิ่มซ้ำ)")) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            // 1. Migrate Profile
            const localName = localStorage.getItem('user_name');
            const localAvatar = localStorage.getItem('user_avatar');

            if (token && (localName || localAvatar)) {
                if (localName) {
                    await axios.patch("http://localhost:3005/api/users/profile", { displayName: localName }, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(e => console.warn("Name restore failed", e));
                }
                if (localAvatar && localAvatar.startsWith('data:')) {
                    // This expects a file upload usually, but we have base64. 
                    // Our backend controller currently expects MULTIPART file.
                    // BUT let's see if we can patch it... No, updateAvatar is not exposed via PATCH directly usually?
                    // The UsersController.uploadAvatar takes @UploadedFile. 
                    // To support base64 restore, we might need to convert base64 to Blob and send as FormData!

                    try {
                        const fetchRes = await fetch(localAvatar);
                        const blob = await fetchRes.blob();
                        const formData = new FormData();
                        formData.append('file', blob, 'avatar.png');

                        await axios.post("http://localhost:3005/api/users/avatar", formData, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    } catch (err) {
                        console.warn("Avatar restore failed", err);
                    }
                }
            }

            // 2. Migrate Finance
            await migrateFromLocalStorage();

            if (typeof window !== 'undefined') {
                localStorage.setItem('last_restore_time', new Date().toLocaleString('th-TH'));
            }

            alert("กู้คืนข้อมูลสำเร็จ! 🎉 กรุณารีเฟรชหน้าจอ");
            window.location.reload();

        } catch (e) {
            console.error(e);
            alert("เกิดข้อผิดพลาดในการกู้คืน");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleRestore}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {loading ? "กำลังกู้คืน..." : "กู้คืนข้อมูล (Restore)"}
        </Button>
    );
}

// Helper to show time from local storage (reacts to updates)
function LastTime({ keyName }: { keyName: string }) {
    const [time, setTime] = useState<string>("-");

    useEffect(() => {
        const load = () => {
            const t = localStorage.getItem(keyName);
            if (t) setTime(t);
        };
        load();
        window.addEventListener('storage', load);
        return () => window.removeEventListener('storage', load);
    }, [keyName]);

    return <span className="font-mono">{time}</span>;
}

export default function SettingsPage() {
    const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
    const { theme, setTheme } = useTheme();
    const [profile, setProfile] = useLocalStorage<any>("user_profile", { displayName: "Lucifer", bio: "", avatar: "" });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Deprecated manual load - useLocalStorage handles this now
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            // LocalStorage Check First
            if (typeof window !== 'undefined') {
                const localName = localStorage.getItem('user_name');
                const localAvatar = localStorage.getItem('user_avatar');
                if (localName || localAvatar) {
                    setProfile((prev: any) => ({
                        ...prev,
                        displayName: localName || prev.displayName,
                        avatar: localAvatar || prev.avatar
                    }));
                }
            }

            const token = localStorage.getItem("authToken");
            if (!token) return;
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:3005/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Merge backend with local if backend is not empty
                if (res.data) setProfile((prev: any) => ({ ...prev, ...res.data }));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Explicit Requirement: Save 'user_name'
            if (typeof window !== 'undefined') {
                localStorage.setItem('user_name', profile.displayName);
            }

            // Backend Sync (Optional/Try)
            const token = localStorage.getItem("authToken");
            if (token) {
                await axios.patch("http://localhost:3005/api/users/profile", {
                    displayName: profile.displayName,
                }, { headers: { Authorization: `Bearer ${token}` } }).catch(err => console.warn("Backend sync failed, using local"));
            }

            alert("บันทึกข้อมูลเรียบร้อยแล้ว ✅");
            // Dispatch event to update other components immediately
            window.dispatchEvent(new Event('storage'));
            // window.location.reload(); // No need to reload with proper state
        } catch (e) {
            console.error(e);
            alert("บันทึกข้อมูลล้มเหลว");
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Convert to Base64 (Reliable Persistence)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;

                // 2. Explicit Requirement: Save 'user_avatar'
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user_avatar', base64);
                }

                // Update State -> useLocalStorage hook will auto-save to "user_profile" too
                setProfile((prev: any) => ({ ...prev, avatar: base64 }));

                // Dispatch event
                window.dispatchEvent(new Event('storage'));
            };
            reader.readAsDataURL(file);

            // 2. Mock Delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert("บันทึกข้อมูลเรียบร้อยแล้ว ✅"); // Reusing the same success message as requested for "Save" but applicable here too or similar
        } catch (error) {
            console.error(error);
            alert("อัปโหลดล้มเหลว กรุณาลองใหม่");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <h1 className="text-3xl font-black text-foreground mb-8 tracking-tight">ตั้งค่าระบบ (Settings)</h1>

            {/* Profile Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-amber-500 border-b border-yellow-500/20 pb-2 mb-4">โปรไฟล์ผู้ใช้ (Profile)</h2>
                <div className="bg-card/50 border border-border shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 backdrop-blur-sm">
                    <div className="w-full relative group cursor-pointer max-w-[150px]" onClick={() => document.getElementById('avatar-upload')?.click()}>
                        <div className="w-32 h-32 rounded-full bg-zinc-900 border-2 border-dashed border-yellow-500/50 flex items-center justify-center overflow-hidden group-hover:border-yellow-400 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-300 mx-auto">
                            {profile.avatar && profile.avatar.startsWith('data:') ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-yellow-500/50 group-hover:text-yellow-400 transition-colors" />
                            )}

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-sm">
                                <Camera className="w-6 h-6 text-yellow-400 mb-1" />
                                <span className="text-[10px] text-yellow-200 font-medium">{uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปโปรไฟล์"}</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                        />
                    </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">ชื่อที่แสดง (Display Name)</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={profile.displayName || ""}
                                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                className="bg-background border border-input rounded-lg px-4 py-2 text-foreground w-full focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            />
                            <Button
                                onClick={handleSave}
                                disabled={saving || loading}
                                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold border-0"
                            >
                                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Mode */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">ความเป็นส่วนตัว (Privacy)</h2>
                <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg transition-colors ${isPrivacyMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            {isPrivacyMode ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg">โหมดความเป็นส่วนตัว (Privacy Mode)</h3>
                            <p className="text-sm text-muted-foreground">เบลอตัวเลขทางการเงินเมื่ออยู่ในที่สาธารณะ</p>
                        </div>
                    </div>
                    <button
                        onClick={togglePrivacyMode}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative shadow-inner ${isPrivacyMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${isPrivacyMode ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
            </section>

            {/* Data Management */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">จัดการข้อมูล (Data Management)</h2>
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-accent/50 transition-colors">
                    <div>
                        <h3 className="font-bold text-foreground text-lg">สำรองข้อมูล (Export Data)</h3>
                        <p className="text-sm text-muted-foreground">ดาวน์โหลดข้อมูลทั้งหมดของคุณเก็บไว้ (JSON Format)</p>
                    </div>
                    <Button
                        onClick={async () => {
                            const token = localStorage.getItem("authToken");
                            if (!token) return;
                            try {
                                const headers = { Authorization: `Bearer ${token}` };
                                const [profile, finance, tasks, journal] = await Promise.all([
                                    axios.get("http://localhost:3005/api/users/profile", { headers }),
                                    axios.get("http://localhost:3005/api/finance/transactions", { headers }),
                                    axios.get("http://localhost:3005/api/productivity/tasks", { headers }),
                                    axios.get("http://localhost:3005/api/mental-health/journal", { headers })
                                ]);

                                const backup = {
                                    timestamp: new Date().toISOString(),
                                    profile: profile.data,
                                    finance: finance.data,
                                    tasks: tasks.data,
                                    journal: journal.data
                                };

                                const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                // Include Time in Filename: YYYY-MM-DD-HH-mm
                                const dateStr = new Date().toISOString().split('T')[0];
                                const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
                                a.download = `mylifeos-backup-${dateStr}-${timeStr}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);

                                // Save Last Backup Time
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('last_backup_time', new Date().toLocaleString('th-TH'));
                                    window.dispatchEvent(new Event('storage')); // Trigger update
                                }

                                alert("กำลังดาวน์โหลด... 📂");
                            } catch (e) {
                                console.error("Export failed", e);
                                alert("การส่งออกข้อมูลล้มเหลว");
                            }
                        }}
                        variant="outline"
                        className="bg-muted border-border hover:bg-accent text-foreground"
                    >
                        <FileText className="w-4 h-4 mr-2" /> Export JSON
                    </Button>
                </div>
                {/* Last Export Time Display */}
                <div className="flex justify-end -mt-2 px-6 pb-2">
                    <p className="text-xs text-zinc-500">
                        Last Backup: <LastTime keyName="last_backup_time" />
                    </p>
                </div>

                {/* RESTORE LEGACY */}
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-accent/50 transition-colors border-amber-500/20">
                    <div>
                        <h3 className="font-bold text-foreground text-lg">กู้คืนข้อมูลเดิม (Restore Legacy)</h3>
                        <p className="text-sm text-amber-500/80">อัปโหลดข้อมูลจาก "ความจำเครื่อง" (Gojo Satoru) ขึ้นสู่ Cloud</p>
                    </div>
                    <RestoreButton />
                </div>
                <div className="flex justify-end -mt-2 px-6 pb-2">
                    <p className="text-xs text-zinc-500">
                        Last Restore: <LastTime keyName="last_restore_time" />
                    </p>
                </div>
            </section>

            {/* System */}
            <section className="space-y-4 pt-4">
                <button
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        window.location.href = '/login';
                    }}
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-xl border border-red-900/30 bg-red-950/10 text-red-500 hover:bg-red-950/30 hover:border-red-900/50 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    ออกจากระบบ (Logout)
                </button>
            </section>
        </div>
    );
}

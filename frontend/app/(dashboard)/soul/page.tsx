import { MoodEnergyChart } from "@/components/soul/MoodEnergyChart";
import { MoodCalendar } from "@/components/soul/MoodCalendar";
import { HabitTracker } from "@/components/soul/HabitTracker";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";

export default function SoulPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent tracking-tight">บันทึกสภาพจิตใจ (Mental Health)</h1>
                    <p className="text-zinc-400">ดูแลสุขภาพใจของคุณด้วย AI (Emotional Intelligence)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoodCalendar />

                <div className="rounded-xl border border-yellow-500/30 bg-zinc-950/80 shadow-lg shadow-yellow-500/10 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-bold text-white">บันทึกความรู้สึก (Journal)</h3>
                    <textarea
                        className="w-full h-32 bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-amber-500 transition-colors text-zinc-200 placeholder:text-zinc-600"
                        placeholder="วันนี้เป็นยังไงบ้าง? เล่าให้ฟังหน่อย..."
                    ></textarea>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-zinc-500">AI พร้อมวิเคราะห์อารมณ์ของคุณ</span>
                        <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold rounded-lg text-sm transition-all shadow-lg shadow-amber-500/20">
                            ✨ วิเคราะห์อารมณ์
                        </button>
                    </div>
                </div>
            </div>

            {/* Habit Tracker Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HabitTracker />

                <div className="rounded-xl border border-yellow-500/30 bg-zinc-950/80 shadow-lg shadow-yellow-500/10 p-6">
                    <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                        คุณภาพการนอนหลับ (Sleep Quality)
                    </h3>
                    <PrivacyBlur>
                        <div className="flex items-end gap-2 h-40 pl-4 border-l border-zinc-800 pt-8">
                            {[6, 7, 5, 8, 6, 7, 8].map((val, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-indigo-900 to-indigo-500 rounded-t-sm hover:from-amber-600 hover:to-yellow-500 transition-all duration-300 group relative" style={{ height: `${val * 10}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}ชม.
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PrivacyBlur>
                    <div className="flex justify-between text-xs text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
                        <span>จันทร์</span>
                        <span>อาทิตย์</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

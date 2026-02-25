import { EisenhowerMatrix } from "@/components/work/EisenhowerMatrix";
import { PomodoroTimer } from "@/components/work/PomodoroTimer";
import { GithubStreak } from "@/components/work/GithubStreak";

export default function WorkstationPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">ศูนย์จัดการงานอัจฉริยะ (AI Manager)</h1>
                    <p className="text-muted-foreground">ศูนย์ควบคุมประสิทธิภาพและโฟกัสของคุณ</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-3 flex flex-col gap-6 h-full">
                    {/* Eisenhower Matrix takes up most space */}
                    <div className="flex-1 min-h-0">
                        <EisenhowerMatrix />
                    </div>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <PomodoroTimer />
                    <GithubStreak />
                </div>
            </div>
        </div>
    );
}

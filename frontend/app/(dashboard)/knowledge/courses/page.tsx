"use client";

import { useKnowledgeSystem } from "@/hooks/useKnowledgeSystem";
import { GraduationCap, Award, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
    const { data, addCourse, updateCourseProgress, deleteCourse } = useKnowledgeSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ title: '', instructor: '' });

    const handleAdd = () => {
        if (form.title) {
            addCourse({ title: form.title, instructor: form.instructor || 'Online' });
            setIsOpen(false);
            setForm({ title: '', instructor: '' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-emerald-400" />
                    คอร์สเรียน (Courses)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-500 rounded-full">
                            <Plus className="w-5 h-5 mr-1" /> Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>เพิ่มคอร์สเรียน</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="ชื่อคอร์ส (Course Name)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="ผู้สอน/แพลตฟอร์ม (Instructor)" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
                            <Button onClick={handleAdd} className="w-full bg-emerald-600 font-bold">บันทึก</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {data.courses.map(course => (
                    <div key={course.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 group hover:border-emerald-500/50 transition-colors">

                        {/* Circular Progress */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="#27272a" strokeWidth="8" fill="none" />
                                <circle cx="40" cy="40" r="36" stroke={course.progress === 100 ? '#10b981' : '#34d399'} strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 36} strokeDashoffset={2 * Math.PI * 36 * (1 - course.progress / 100)} className="transition-all duration-1000" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {course.progress === 100 ? <Award className="w-8 h-8 text-emerald-500 fill-emerald-500/20" /> : <span className="text-sm font-bold text-white">{course.progress}%</span>}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                                {course.title}
                                {course.progress === 100 && <span className="text-xs bg-emerald-500 text-black px-2 py-0.5 rounded font-black uppercase">Completed</span>}
                            </h3>
                            <p className="text-zinc-500">{course.instructor}</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <input
                                type="range"
                                min="0" max="100"
                                value={course.progress}
                                onChange={e => updateCourseProgress(course.id, parseInt(e.target.value))}
                                className="flex-1 md:w-48 accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none"
                            />
                            <button onClick={() => deleteCourse(course.id)} className="text-zinc-700 hover:text-red-500">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {data.courses.length === 0 && <p className="text-center text-zinc-500 py-12">ยังไม่ได้ลงทะเบียนคอร์สเรียน</p>}
        </div>
    );
}

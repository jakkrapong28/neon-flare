"use client";

import { useState, useEffect, useCallback } from 'react';

// --- Types ---
export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'doing' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    category?: string;
}

export interface Meeting {
    id: string;
    title: string;
    date: string; // ISO Date
    time: string; // HH:mm
    link?: string;
    platform?: 'Zoom' | 'Meet' | 'Teams' | 'Other';
}

export interface OKR {
    id: string;
    objective: string;
    keyResults: { id: string; title: string; current: number; target: number; unit: string }[];
    progress: number; // 0-100%
}

export interface WorkData {
    tasks: Task[];
    meetings: Meeting[];
    okrs: OKR[];
    pomodoro: {
        timeLeft: number;
        isActive: boolean;
        mode: 'FOCUS' | 'BREAK';
    };
    memos: { id: string; title: string; path: string; date: string; duration?: string }[];
}

const INITIAL_DATA: WorkData = {
    tasks: [],
    meetings: [],
    okrs: [],
    pomodoro: { timeLeft: 25 * 60, isActive: false, mode: 'FOCUS' },
    memos: []
};

const STORAGE_KEY = 'neon_work_core';

export function useWorkSystem() {
    const [data, setData] = useState<WorkData>(INITIAL_DATA);
    const [mounted, setMounted] = useState(false);

    // Initial Load
    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setData({ ...INITIAL_DATA, ...JSON.parse(stored) });
                } catch (e) {
                    console.error("Failed to parse work data", e);
                }
            }
        }
    }, []);

    // Persist
    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            window.dispatchEvent(new Event('work-core-update'));
        }
    }, [data, mounted]);

    // --- Actions ---

    // Tasks
    const addTask = (task: Omit<Task, 'id' | 'status'>) => {
        const newTask = { ...task, id: Date.now().toString(), status: 'todo' as const };
        setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    };

    const updateTaskStatus = (id: string, status: Task['status']) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, status } : t)
        }));
    };

    const deleteTask = (id: string) => {
        setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    };

    // Meetings
    const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
        const newMeeting = { ...meeting, id: Date.now().toString() };
        setData(prev => ({ ...prev, meetings: [...prev.meetings, newMeeting].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }));
    };

    const deleteMeeting = (id: string) => {
        setData(prev => ({ ...prev, meetings: prev.meetings.filter(m => m.id !== id) }));
    };

    // OKRs
    const addOKR = (okr: Omit<OKR, 'id' | 'progress'>) => {
        const newOKR = { ...okr, id: Date.now().toString(), progress: 0 };
        setData(prev => ({ ...prev, okrs: [...prev.okrs, newOKR] }));
    };

    // Memos
    const addMemo = (title: string, duration?: string) => {
        const newMemo = {
            id: Date.now().toString(),
            title,
            path: '/voice-note-mock.mp3',
            date: new Date().toLocaleString('th-TH'),
            duration: duration || '00:00'
        };
        setData(prev => ({ ...prev, memos: [newMemo, ...prev.memos] }));
    };

    const deleteMemo = (id: string) => {
        setData(prev => ({ ...prev, memos: prev.memos.filter(m => m.id !== id) }));
    };

    // Analytics
    const getWorkScore = useCallback(() => {
        if (data.tasks.length === 0) return 50; // Neutral start
        const done = data.tasks.filter(t => t.status === 'done').length;
        return Math.round((done / data.tasks.length) * 100);
    }, [data.tasks]);

    return {
        data,
        mounted,
        addTask, updateTaskStatus, deleteTask,
        addMeeting, deleteMeeting,
        addOKR,
        addMemo, deleteMemo,
        getWorkScore
    };
}

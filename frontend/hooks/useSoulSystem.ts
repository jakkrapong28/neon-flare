import { useState, useEffect } from 'react';

export type MoodType = 'Happy' | 'Calm' | 'Tired' | 'Sad' | 'Angry';

export interface MoodRecord {
    id: string;
    date: string;
    timestamp: string;
    mood: MoodType;
}

export interface GratitudeRecord {
    id: string;
    date: string;
    items: string[];
}

export interface DetoxRecord {
    id: string;
    date: string;
    duration: number; // seconds
}

export interface SoulData {
    moods: MoodRecord[];
    gratitude: GratitudeRecord[];
    detox: DetoxRecord[];
}

const INITIAL_DATA: SoulData = {
    moods: [],
    gratitude: [],
    detox: []
};

const STORAGE_KEY = 'neon_soul_core';

export function useSoulSystem() {
    const [data, setData] = useState<SoulData>(INITIAL_DATA);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setData(JSON.parse(stored));
                } catch (e) { console.error("Soul Data Parse Error", e); }
            }
        }
    }, []);

    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data, mounted]);

    // Actions
    const addMood = (mood: MoodType) => {
        const newMood: MoodRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            mood
        };
        setData(prev => ({ ...prev, moods: [newMood, ...prev.moods] }));
    };

    const addGratitude = (items: string[]) => {
        const newGratitude: GratitudeRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            items
        };
        setData(prev => ({ ...prev, gratitude: [newGratitude, ...prev.gratitude] }));
    };

    const addDetoxSession = (duration: number) => {
        const newDetox: DetoxRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            duration
        };
        setData(prev => ({ ...prev, detox: [newDetox, ...prev.detox] }));
    };

    const getMentalScore = () => {
        // Simple logic: Gratitude today? + Mood (Happy=high, Sad=low) consistency
        // This is just a placeholder logic for now
        let score = 50;
        const today = new Date().toISOString().split('T')[0];

        if (data.gratitude.some(g => g.date === today)) score += 20;

        const recentMoods = data.moods.slice(0, 5);
        const happyCount = recentMoods.filter(m => m.mood === 'Happy' || m.mood === 'Calm').length;
        score += (happyCount * 5); // Max +25

        const detoxToday = data.detox.filter(d => d.date === today).reduce((acc, curr) => acc + curr.duration, 0);
        if (detoxToday > 1800) score += 10; // > 30 mins

        return Math.min(100, score);
    };

    return {
        data, mounted,
        addMood, addGratitude, addDetoxSession,
        getMentalScore
    };
}

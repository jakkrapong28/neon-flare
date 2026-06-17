import { useState, useEffect, useCallback } from 'react';

export interface SleepRecord {
    id: string;
    date: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    duration: number; // Hours
}

export interface WorkoutRecord {
    id: string;
    date: string;
    type: string;
    duration: number; // Minutes
    calories: number;
}

export interface WeightRecord {
    id: string;
    date: string;
    weight: number;
    bmi: number;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    time: 'Morning' | 'Noon' | 'Evening' | 'Bedtime';
    taken: boolean;
}

export interface MealPlan {
    day: string; // "Mon", "Tue"
    meals: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snack: string;
    };
}

export interface CaloriesRecord {
    date: string;
    bmr: number;
    tdee: number;
    goal: 'CUT' | 'MAINTAIN' | 'BULK';
    target: number;
}

export interface HealthData {
    sleep: SleepRecord[];
    water: { date: string; amount: number; goal: number };
    fasting: { isActive: boolean; startTime: string | null; targetHours: number };
    workouts: WorkoutRecord[];
    weights: WeightRecord[];
    meds: Medication[];
    calories: CaloriesRecord | null;
    mealPlan: MealPlan[];
    lastMedsReset: string; // Date string
}

const INITIAL_DATA: HealthData = {
    sleep: [],
    water: { date: new Date().toISOString().split('T')[0], amount: 0, goal: 2000 },
    fasting: { isActive: false, startTime: null, targetHours: 16 },
    workouts: [],
    weights: [],
    meds: [],
    calories: null,
    mealPlan: [],
    lastMedsReset: ''
};

const STORAGE_KEY = 'neon_health_core';

export function useHealthSystem() {
    const [data, setData] = useState<HealthData>(INITIAL_DATA);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handle = requestAnimationFrame(() => {
            setMounted(true);
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        // Check if date changed for water
                        const today = new Date().toISOString().split('T')[0];
                        if (parsed.water.date !== today) {
                            parsed.water = { date: today, amount: 0, goal: 2000 };
                        }
                        // Merge stored data with INITIAL_DATA to ensure new fields (like mealPlan) exist
                        setData({ ...INITIAL_DATA, ...parsed });
                    } catch (e) { console.error("Health Data Parse Error", e); }
                }
            }
        });
        return () => cancelAnimationFrame(handle);
    }, []);

    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            window.dispatchEvent(new Event('health-core-update'));
        }
    }, [data, mounted]);

    // --- Actions ---

    // Sleep
    const addSleep = (record: Omit<SleepRecord, 'id' | 'duration'>) => {
        // Calculate duration simple logic
        const start = parseInt(record.startTime.split(':')[0]) + parseInt(record.startTime.split(':')[1]) / 60;
        const end = parseInt(record.endTime.split(':')[0]) + parseInt(record.endTime.split(':')[1]) / 60;
        let diff = end - start;
        if (diff < 0) diff += 24; // Crossed midnight

        setData(prev => ({
            ...prev,
            sleep: [...prev.sleep, { ...record, id: Date.now().toString(), duration: parseFloat(diff.toFixed(1)) }]
        }));
    };

    // Water
    const addWater = (amount: number) => {
        setData(prev => ({
            ...prev,
            water: { ...prev.water, amount: Math.min(prev.water.amount + amount, 5000) } // Cap at 5L safety
        }));
    };

    // Fasting
    const toggleFasting = () => {
        setData(prev => ({
            ...prev,
            fasting: {
                ...prev.fasting,
                isActive: !prev.fasting.isActive,
                startTime: !prev.fasting.isActive ? new Date().toISOString() : null
            }
        }));
    };

    // Workout
    const addWorkout = (workout: Omit<WorkoutRecord, 'id'>) => {
        setData(prev => ({
            ...prev,
            workouts: [...prev.workouts, { ...workout, id: Date.now().toString() }]
        }));
    };

    // Weight
    const addWeight = (kg: number, heightCm: number = 175) => {
        const bmi = kg / ((heightCm / 100) * (heightCm / 100));
        setData(prev => ({
            ...prev,
            weights: [...prev.weights, { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], weight: kg, bmi: parseFloat(bmi.toFixed(1)) }]
        }));
    };

    // Score
    const getHealthScore = useCallback(() => {
        let score = 0;
        // Water (30%)
        if (data.water.amount >= data.water.goal) score += 30;
        else score += (data.water.amount / data.water.goal) * 30;

        // Sleep (35%) - Last night
        const lastSleep = data.sleep[data.sleep.length - 1];
        if (lastSleep && lastSleep.duration >= 7) score += 35;
        else if (lastSleep) score += (lastSleep.duration / 7) * 35;

        // Workout (35%) - Today
        const today = new Date().toISOString().split('T')[0];
        const todayWorkout = data.workouts.some(w => w.date === today);
        if (todayWorkout) score += 35;

        return Math.round(score);
    }, [data]);

    // Meds
    const addMed = (med: Omit<Medication, 'id'>) => {
        setData(prev => ({ ...prev, meds: [...prev.meds, { ...med, id: Date.now().toString() }] }));
    };

    const toggleMed = (id: string) => {
        setData(prev => ({
            ...prev,
            meds: prev.meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m)
        }));
    };

    const deleteMed = (id: string) => {
        setData(prev => ({ ...prev, meds: prev.meds.filter(m => m.id !== id) }));
    };

    // Calories
    const saveCalorieTarget = (record: CaloriesRecord) => {
        setData(prev => ({ ...prev, calories: record }));
    };

    // Meal Plan
    const updateMealPlan = (day: string, meals: MealPlan['meals']) => {
        setData(prev => {
            const existing = prev.mealPlan.findIndex(p => p.day === day);
            if (existing >= 0) {
                const newPlan = [...prev.mealPlan];
                newPlan[existing] = { day, meals };
                return { ...prev, mealPlan: newPlan };
            }
            return { ...prev, mealPlan: [...prev.mealPlan, { day, meals }] };
        });
    };

    return {
        data, mounted,
        addSleep, addWater, toggleFasting, addWorkout, addWeight,
        addMed, toggleMed, deleteMed,
        saveCalorieTarget,
        updateMealPlan,
        getHealthScore
    };
}

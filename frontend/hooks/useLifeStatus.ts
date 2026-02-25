"use client";

import { useState, useEffect } from 'react';

export interface LifeStatus {
    soul: number;
    wealth: number;
    power: number;
    state: string;
    action: string;
    loading: boolean;
}

import axios from 'axios';

export const useLifeStatus = (date?: Date) => {
    const [status, setStatus] = useState<LifeStatus>({
        soul: 0,
        wealth: 0,
        power: 0,
        state: 'LOADING...',
        action: 'Initializing system...',
        loading: true,
    });

    useEffect(() => {
        const fetchStatus = async () => {
            setStatus(prev => ({ ...prev, loading: true }));
            try {
                // Determine API URL (client-side env var)
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
                const dateParam = date ? `?date=${date.toISOString()}` : '';

                // Fetch from Backend
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await axios.get(`${baseUrl}/api/v1/life-OS/status${dateParam}`, { headers });
                const data = res.data;

                // Backend returns: { scores: { soul, wealth, power }, state, recommendedAction }
                setStatus({
                    soul: data.scores.soul,
                    wealth: data.scores.wealth,
                    power: data.scores.power,
                    state: data.state,
                    action: data.recommendedAction,
                    loading: false,
                });
            } catch (error) {
                console.error("Failed to fetch life status", error);
                setStatus({
                    soul: 50,
                    wealth: 50,
                    power: 50,
                    state: 'OFFLINE',
                    action: 'Connection lost. Unable to sync life state.',
                    loading: false,
                });
            }
        };

        fetchStatus();
    }, [date]);

    return status;
};

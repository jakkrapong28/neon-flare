"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Types ---
export interface Transaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    category: string;
    date: string;
    note?: string;
}

export interface DebtItem {
    id: string;
    name: string;
    amount: number;      // Total debt amount
    remainingAmount: number; // Current remaining amount
    interestRate: number;
    minPayment: number;
    dueDate: number; // Day of month
    totalMonths: number;
    paidMonths: number;
    monthlyInstallment?: number; // Explicit monthly payment
}

export interface Asset {
    id: string;
    name: string;
    symbol: string; // BTC, AAPL, Cash
    type: 'STOCK' | 'CRYPTO' | 'CASH' | 'REAL_ESTATE' | 'OTHER';
    quantity: number;
    avgPrice: number;
    currentPrice: number;
}

export interface BillItem {
    id: string;
    name: string;
    amount: number;
    dueDate: number; // Day of month
    isPaid: boolean;
    type: 'BILL' | 'SUBSCRIPTION';
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    icon?: string;
    color?: string;
}

export interface FinanceData {
    transactions: Transaction[];
    debts: DebtItem[];
    investments: Asset[];
    bills: BillItem[];
    goals: SavingsGoal[];
    categories: string[];
}

const INITIAL_DATA: FinanceData = {
    transactions: [],
    debts: [],
    investments: [],
    bills: [],
    goals: [],
    categories: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Home', 'Education', 'Debt', 'Investment', 'Other']
};

const API_Base = "http://localhost:3005/api/finance";

export function useFinanceSystem() {
    const [data, setData] = useState<FinanceData>(INITIAL_DATA);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            const [transactions, budgets, subscriptions, goals] = await Promise.all([
                axios.get(`${API_Base}/transactions`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_Base}/budgets`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_Base}/subscriptions`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_Base}/goals`, { headers }).catch(() => ({ data: [] })),
            ]);

            // Need to map backend schemas to frontend types if they differ significantly
            // For now assuming 1:1 or close enough to work with spread
            // NOTE: Backend might return raw MongoDB _id, frontend uses id. 
            // We might need to transform _id -> id or update frontend to use _id.
            // Let's assume we map _id to id for consistency.

            const mapId = (items: any[]) => items.map(item => ({ ...item, id: item._id || item.id }));

            setData(prev => ({
                ...prev,
                transactions: mapId(transactions.data).reverse(), // Newest first
                bills: mapId(subscriptions.data), // Mapping Subscriptions to Bills for now
                goals: mapId(goals.data).filter((g: any) => g.type !== 'DEBT'),
                debts: mapId(goals.data)
                    .filter((g: any) => g.type === 'DEBT')
                    .map((g: any) => ({
                        ...g,
                        amount: g.targetAmount,
                        remainingAmount: g.targetAmount - g.currentAmount,
                        paidMonths: g.paidMonths || 0,
                        interestRate: g.interestRate || 0,
                        minPayment: g.minPayment || 0,
                        dueDate: g.dueDate || 1,
                        totalMonths: g.totalMonths || 12
                    })),
            }));

        } catch (e) {
            console.error("Failed to fetch finance data", e);
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---
    const getNetWorth = useCallback(() => {
        // Cash = Income - Expense (History)
        const cashBalance = data.transactions.reduce((acc, t) => t.type === 'INCOME' ? acc + t.amount : acc - t.amount, 0);

        // Investments
        const investmentsValue = data.investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);

        // Debt (Liability) - USER REQUEST: Do NOT subtract total debt. Only count paid installments (which are expenses).
        // const totalDebt = data.debts.reduce((acc, d) => acc + d.remainingAmount, 0);

        // Return Total Assets (Cash + Investments) instead of strict Net Worth
        return (cashBalance + investmentsValue);
    }, [data]);

    // --- Helpers with Thai Time (UTC+7) ---
    const getThaiDateStr = (dateInput: string | Date) => {
        const date = new Date(dateInput);
        // Shift to UTC+7
        const thaiTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        return thaiTime.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const getSummary = useCallback((targetDate?: Date) => {
        const now = targetDate || new Date();
        // Thai Year/Month
        const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const currentMonth = thaiNow.toISOString().slice(0, 7); // YYYY-MM

        const incomeAll = data.transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
        const expenseAll = data.transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

        const incomeMonth = data.transactions
            .filter(t => t.type === 'INCOME' && getThaiDateStr(t.date).startsWith(currentMonth))
            .reduce((s, t) => s + t.amount, 0);

        const expenseMonth = data.transactions
            .filter(t => t.type === 'EXPENSE' && getThaiDateStr(t.date).startsWith(currentMonth))
            .reduce((s, t) => s + t.amount, 0);

        return {
            totalBalance: incomeAll - expenseAll,
            incomeMonth,
            expenseMonth,
            netWorth: getNetWorth()
        };
    }, [data, getNetWorth]);

    // --- Actions ---

    const getHeaders = () => {
        const token = localStorage.getItem("authToken");
        return { Authorization: `Bearer ${token}` };
    };

    // Transactions
    const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
        try {
            // Optimistic UI Update
            const tempId = Date.now().toString();
            const newTx = { ...tx, id: tempId };
            setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));

            const response = await axios.post(`${API_Base}/transactions`, tx, { headers: getHeaders() });

            // Update with real ID
            setData(prev => ({
                ...prev,
                transactions: prev.transactions.map(t => t.id === tempId ? { ...t, id: response.data._id || response.data.id } : t)
            }));

            return response.data;
        } catch (error) {
            console.error("Failed to add transaction", error);
            // Revert on failure (could be improved)
            fetchData();
            throw error;
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            // Optimistic Update
            setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));

            // Backend Sync
            await axios.delete(`${API_Base}/transactions/${id}`, { headers: getHeaders() });
        } catch (error) {
            console.error("Failed to delete", error);
            // Revert if failed
            fetchData();
        }
    };

    // Debt (Mapped to Goals with type=DEBT or separate API? Backend has Goals type='DEBT')
    const addDebt = async (debt: Omit<DebtItem, 'id' | 'paidMonths'>) => {
        // Backend expects 'goals' with type=DEBT usually for this system based on alerts logic I saw
        // We will post to /goals with type='DEBT'
        try {
            const payload = {
                ...debt,
                targetAmount: debt.amount,
                currentAmount: debt.amount - debt.remainingAmount, // Inverted logic for Goal?
                // Wait, Debt is liability. Goal is Asset.
                // Let's stick to Local Store logic for complex items OR map to /goals if that's the intention.
                // Re-reading Backend: finance.service.ts -> findAllGoals returns goalModel.
                // Alerts check goalModel with type='DEBT'.
                type: 'DEBT'
            };

            const res = await axios.post(`${API_Base}/goals`, payload, { headers: getHeaders() });
            setData(prev => ({ ...prev, debts: [...prev.debts, { ...debt, id: res.data._id, paidMonths: 0 }] }));
        } catch (e) {
            console.error(e);
        }
    };

    const deleteDebt = (id: string) => {
        // setData(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== id) }));
        axios.delete(`${API_Base}/goals/${id}`, { headers: getHeaders() })
            .then(() => fetchData());
    };

    const payDebt = (id: string, amount: number) => {
        // Complex logic: Add Expense AND Update Debt
        // 1. Add Expense
        const debt = data.debts.find(d => d.id === id);
        if (debt) {
            addTransaction({
                type: 'EXPENSE',
                amount: amount,
                category: 'Debt',
                date: new Date().toISOString(),
                note: `Installment: ${debt.name}`
            });

            // 2. Update Debt
            // We need a PATCH endpoint for goals/debts. Backend has updateGoal.
            // Calculation:
            const newRemaining = Math.max(0, debt.remainingAmount - amount);
            // If mapping to Goal: currentAmount is how much paid? or how much remaining?
            // Usually Goal: currentAmount starts 0, goes to target.
            // Debt: starts full, goes to 0. 
            // In backend service checkUpcomingRenewals: if (debt.currentAmount < debt.targetAmount * 0.1) -> means currentAmount is PAYMENTS MADE?
            // "If debt payment is low... if (debt.currentAmount < debt.targetAmount * 0.1)"
            // This suggests currentAmount is "Value of asset" or "Progress made".
            // So for Debt, currentAmount = Paid Amount.
            // TargetAmount = Total Debt.
            // Remaining = Target - Current.

            const currentPaid = (debt.amount - debt.remainingAmount);
            const newPaid = currentPaid + amount;

            axios.post(`${API_Base}/goals/${id}`, { currentAmount: newPaid }, { headers: getHeaders() })
                .then(() => fetchData());
        }
    };

    // Investments (No endpoint in basic controller? We might skip or mock)
    const addInvestment = (asset: Omit<Asset, 'id'>) => {
        const newAsset = { ...asset, id: Date.now().toString() };
        setData(prev => ({ ...prev, investments: [...prev.investments, newAsset] }));
    };

    const updateInvestmentPrice = (id: string, newPrice: number) => {
        setData(prev => ({
            ...prev,
            investments: prev.investments.map(inv =>
                inv.id === id ? { ...inv, currentPrice: newPrice } : inv
            )
        }));
    };

    // Bills -> Subscriptions
    const addBill = async (bill: Omit<BillItem, 'id' | 'isPaid'>) => {
        try {
            // Map to Subscription
            const payload = {
                name: bill.name,
                amount: bill.amount,
                cycle: 'MONTHLY', // Default
                nextBillingDate: new Date(), // Logic needed
                type: bill.type
            };
            // Using createSubscription
            const res = await axios.post(`${API_Base}/subscriptions`, payload, { headers: getHeaders() });
            fetchData();
        } catch (e) { console.error(e) }
    };

    const markBillPaid = (id: string) => {
        const bill = data.bills.find(b => b.id === id);
        if (bill) {
            addTransaction({
                type: 'EXPENSE',
                amount: bill.amount,
                category: 'Utilities',
                date: new Date().toISOString(),
                note: `Bill: ${bill.name}`
            });
            // Update local state temporarily
            setData(prev => ({
                ...prev,
                bills: prev.bills.map(b => b.id === id ? { ...b, isPaid: true } : b)
            }));
        }
    };

    const deleteBill = async (id: string) => {
        try {
            await axios.delete(`${API_Base}/subscriptions/${id}`, { headers: getHeaders() });
            fetchData();
        } catch (e) { console.error(e) }
    };


    // Goals
    const addGoal = async (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
        try {
            await axios.post(`${API_Base}/goals`, goal, { headers: getHeaders() });
            fetchData();
        } catch (e) { console.error(e) }
    };

    const depositToGoal = (id: string, amount: number) => {
        // Deduct from main balance (transfer)
        addTransaction({
            type: 'EXPENSE',
            amount: amount,
            category: 'Savings',
            date: new Date().toISOString(),
            note: `Deposit to Goal`
        });

        // Update Goal
        const goal = data.goals.find(g => g.id === id);
        if (goal) {
            axios.post(`${API_Base}/goals/${id}`, { currentAmount: goal.currentAmount + amount }, { headers: getHeaders() })
                .then(() => fetchData());
        }
    };

    const deleteGoal = async (id: string) => {
        try {
            await axios.delete(`${API_Base}/goals/${id}`, { headers: getHeaders() });
            fetchData();
        } catch (e) { console.error(e) }
    };

    // Categories
    const addCategory = (name: string) => {
        if (!data.categories.includes(name)) {
            setData(prev => ({ ...prev, categories: [...prev.categories, name] }));
        }
    };

    const removeCategory = (name: string) => {
        setData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== name) }));
    };

    // --- Migration ---
    const migrateFromLocalStorage = async () => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('neon_finance_core');
        if (!stored) return;

        try {
            setLoading(true);
            const localData: FinanceData = JSON.parse(stored);
            const headers = getHeaders();

            // 1. Transactions
            for (const tx of localData.transactions) {
                await axios.post(`${API_Base}/transactions`, {
                    type: tx.type,
                    amount: tx.amount,
                    category: tx.category,
                    date: tx.date,
                    note: tx.note
                }, { headers });
            }

            // 2. Bills -> Subscriptions
            for (const bill of localData.bills) {
                await axios.post(`${API_Base}/subscriptions`, {
                    name: bill.name,
                    amount: bill.amount,
                    cycle: 'MONTHLY',
                    nextBillingDate: new Date(),
                    type: bill.type
                }, { headers });
            }

            // 3. Goals & Debts -> Goals
            // Handle possibility of debt vs goal in local storage
            const allGoals = [...localData.goals, ...(localData.debts || []).map(d => ({ ...d, type: 'DEBT' } as any))];

            for (const goal of allGoals) {
                await axios.post(`${API_Base}/goals`, {
                    name: goal.name,
                    targetAmount: (goal as any).targetAmount || (goal as any).amount,
                    currentAmount: (goal as any).currentAmount || ((goal as any).amount - (goal as any).remainingAmount) || 0,
                    type: (goal as any).type || 'SAVINGS',
                    deadline: (goal as any).deadline
                }, { headers });
            }

            fetchData();
            return true;
        } catch (e) {
            console.error("Migration failed", e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getChartData = useCallback((targetDate?: Date) => {
        const now = targetDate || new Date();
        const thaiNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const currentMonth = thaiNow.toISOString().slice(0, 7); // YYYY-MM

        const grouped: Record<string, { income: number; expense: number }> = {};

        // Initialize all days in month
        const daysInMonth = new Date(thaiNow.getFullYear(), thaiNow.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayStr = `${currentMonth}-${i.toString().padStart(2, '0')}`;
            grouped[dayStr] = { income: 0, expense: 0 };
        }

        data.transactions.forEach(t => {
            if (!t.date) return;
            const thaiDateStr = getThaiDateStr(t.date);

            if (thaiDateStr.startsWith(currentMonth)) {
                if (grouped[thaiDateStr]) {
                    if (t.type === 'INCOME') grouped[thaiDateStr].income += t.amount;
                    else grouped[thaiDateStr].expense += t.amount;
                }
            }
        });

        return Object.entries(grouped)
            .map(([date, val]) => ({ date, ...val }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data.transactions]);

    return {
        data,
        mounted,
        getNetWorth,
        getSummary,
        getChartData,
        // Actions
        addTransaction, deleteTransaction,
        addDebt, payDebt, deleteDebt,
        addInvestment, updateInvestmentPrice,
        addBill, markBillPaid, deleteBill,
        addGoal, depositToGoal, deleteGoal,
        addCategory, removeCategory,
        // Migration
        migrateFromLocalStorage
    };
}

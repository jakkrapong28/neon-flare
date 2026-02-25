export interface Transaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    category: string;
    date: string;
    note?: string;
}

export interface Subscription {
    id: string;
    name: string;
    price: number;
    date: string; // Day of month (1-31)
    cycle: "Monthly" | "Yearly";
}

// Helper to get data safely
const getLocal = <T>(key: string, defaultVal: T): T => {
    if (typeof window === 'undefined') return defaultVal;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const setLocal = (key: string, val: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
    // Dispatch event for reactive updates across components
    window.dispatchEvent(new Event('finance-update'));
};

const FINANCE_KEYS = {
    TX: 'finance_transactions',
    SUB: 'finance_subscriptions'
};

export const financeStore = {
    getTransactions: (): Transaction[] => getLocal(FINANCE_KEYS.TX, []),

    addTransaction: (tx: Omit<Transaction, 'id'>) => {
        const current = getLocal<Transaction[]>(FINANCE_KEYS.TX, []);
        const newTx = { ...tx, id: Date.now().toString() };
        setLocal(FINANCE_KEYS.TX, [newTx, ...current]);
        return newTx;
    },

    deleteTransaction: (id: string) => {
        const current = getLocal<Transaction[]>(FINANCE_KEYS.TX, []);
        setLocal(FINANCE_KEYS.TX, current.filter(t => t.id !== id));
    },

    getSubscriptions: (): Subscription[] => getLocal(FINANCE_KEYS.SUB, []),

    addSubscription: (sub: Omit<Subscription, 'id'>) => {
        const current = getLocal<Subscription[]>(FINANCE_KEYS.SUB, []);
        const newSub = { ...sub, id: Date.now().toString() };
        setLocal(FINANCE_KEYS.SUB, [...current, newSub]);
        return newSub;
    },

    deleteSubscription: (id: string) => {
        const current = getLocal<Subscription[]>(FINANCE_KEYS.SUB, []);
        setLocal(FINANCE_KEYS.SUB, current.filter(s => s.id !== id));
    },

    // Analysis Logic
    getSummary: () => {
        const txs = getLocal<Transaction[]>(FINANCE_KEYS.TX, []);
        const income = txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
        const expense = txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
        return { income, expense, balance: income - expense };
    },

    getChartData: () => {
        const txs = getLocal<Transaction[]>(FINANCE_KEYS.TX, []);
        // Group by Date (Last 7 Days ideally, but simple grouping for now)
        const grouped: Record<string, { income: number; expense: number }> = {};

        txs.forEach(t => {
            if (!grouped[t.date]) grouped[t.date] = { income: 0, expense: 0 };
            if (t.type === 'INCOME') grouped[t.date].income += t.amount;
            else grouped[t.date].expense += t.amount;
        });

        return Object.entries(grouped)
            .map(([date, val]) => ({ date, ...val }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7); // Last 7 records
    },

    calculateFinanceScore: (): number => {
        const { income, expense } = financeStore.getSummary();
        if (income === 0 && expense === 0) return 50; // Neutral

        const ratio = (expense / (income || 1)) * 100;

        // Scoring Logic similar to credit score but simple
        if (ratio > 100) return 20; // Overspent
        if (ratio > 80) return 50;  // Tight
        if (ratio > 50) return 80;  // Healthy
        return 100; // Excellent Saver
    }
};

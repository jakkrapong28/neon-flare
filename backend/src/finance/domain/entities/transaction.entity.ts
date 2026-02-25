export class Transaction {
    id: string;
    userId: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date: Date;
    isRecurring: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Transaction>) {
        Object.assign(this, partial);
    }
}

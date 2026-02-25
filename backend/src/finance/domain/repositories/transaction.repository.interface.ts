import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    findAllByUserId(userId: string): Promise<Transaction[]>;
    findById(id: string): Promise<Transaction | null>;
    update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null>;
    delete(id: string): Promise<void>;
    findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
    getExpensesTotal(userId: string, since: Date): Promise<number>;
    getDailyTotals(userId: string, startDate: Date, endDate: Date): Promise<{ day: number, month: number, year: number, type: string, amount: number }[]>;
    getExpensesByCategory(userId: string, startDate: Date): Promise<{ category: string, total: number }[]>;
}

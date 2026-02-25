import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Transaction as TransactionDocument } from '../schemas/transaction.schema';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(@InjectModel(TransactionDocument.name) private transactionModel: Model<TransactionDocument>) { }

    async create(transaction: Transaction): Promise<Transaction> {
        const createdTransaction = new this.transactionModel(transaction);
        const saved = await createdTransaction.save();
        return this.toEntity(saved);
    }

    async findAllByUserId(userId: string): Promise<Transaction[]> {
        const docs = await this.transactionModel.find({ userId }).exec();
        return docs.map(doc => this.toEntity(doc));
    }

    async findById(id: string): Promise<Transaction | null> {
        const doc = await this.transactionModel.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }

    async update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
        const updated = await this.transactionModel.findByIdAndUpdate(id, transaction, { new: true }).exec();
        return updated ? this.toEntity(updated) : null;
    }

    async delete(id: string): Promise<void> {
        await this.transactionModel.findByIdAndDelete(id).exec();
    }

    async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
        const docs = await this.transactionModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).exec();
        return docs.map(doc => this.toEntity(doc));
    }

    async getExpensesTotal(userId: string, since: Date): Promise<number> {
        const result = await this.transactionModel.aggregate([
            {
                $match: {
                    userId,
                    type: 'EXPENSE',
                    date: { $gte: since }
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: '$amount' }
                }
            }
        ]);
        return result.length > 0 ? result[0].totalExpense : 0;
    }

    async getDailyTotals(userId: string, startDate: Date, endDate: Date): Promise<{ day: number, month: number, year: number, type: string, amount: number }[]> {
        const result = await this.transactionModel.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        return result.map(item => ({
            day: item._id.day,
            month: item._id.month,
            year: item._id.year,
            type: item._id.type,
            amount: item.total
        }));
    }

    async getExpensesByCategory(userId: string, startDate: Date): Promise<{ category: string, total: number }[]> {
        const result = await this.transactionModel.aggregate([
            {
                $match: {
                    userId,
                    type: 'EXPENSE',
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            }
        ]);
        return result.map(item => ({ category: item._id, total: item.total }));
    }

    private toEntity(doc: any): Transaction {
        return new Transaction({
            id: doc._id.toString(),
            userId: doc.userId,
            description: doc.description,
            amount: doc.amount,
            type: doc.type,
            category: doc.category,
            date: doc.date,
            isRecurring: doc.isRecurring,
            tags: doc.tags,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
}

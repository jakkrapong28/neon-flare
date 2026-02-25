import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMoodLogRepository } from '../../domain/repositories/mood-log.repository.interface';
import { MoodLog } from '../../domain/entities/mood-log.entity';
import { MoodLog as MoodLogDocument } from '../schemas/mood-log.schema';

@Injectable()
export class MoodLogRepository implements IMoodLogRepository {
    constructor(@InjectModel(MoodLogDocument.name) private moodLogModel: Model<MoodLogDocument>) { }

    async create(moodLog: MoodLog): Promise<MoodLog> {
        const createdLog = new this.moodLogModel(moodLog);
        const saved = await createdLog.save();
        return this.toEntity(saved);
    }

    async findAllByUserId(userId: string): Promise<MoodLog[]> {
        const docs = await this.moodLogModel.find({ userId }).sort({ date: -1 }).exec();
        return docs.map(doc => this.toEntity(doc));
    }

    async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<MoodLog[]> {
        const docs = await this.moodLogModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 }).exec();
        return docs.map(doc => this.toEntity(doc));
    }

    async getLatest(userId: string): Promise<MoodLog | null> {
        const doc = await this.moodLogModel.findOne({ userId }).sort({ date: -1 }).exec();
        return doc ? this.toEntity(doc) : null;
    }

    private toEntity(doc: any): MoodLog {
        return new MoodLog({
            id: doc._id.toString(),
            userId: doc.userId,
            moodScore: doc.moodScore,
            energyScore: doc.energyScore,
            sleepHours: doc.sleepHours,
            journalNote: doc.journalNote,
            sentiment: doc.sentiment,
            date: doc.date,
        });
    }
}

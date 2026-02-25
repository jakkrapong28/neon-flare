import { MoodLog } from '../entities/mood-log.entity';

export interface IMoodLogRepository {
    create(moodLog: MoodLog): Promise<MoodLog>;
    findAllByUserId(userId: string): Promise<MoodLog[]>;
    findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<MoodLog[]>;
    getLatest(userId: string): Promise<MoodLog | null>;
}

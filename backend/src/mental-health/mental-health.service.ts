import { Injectable, Inject } from '@nestjs/common';
import { MoodLog } from './domain/entities/mood-log.entity';
import type { IMoodLogRepository } from './domain/repositories/mood-log.repository.interface';
import { RagService } from '../ai/rag.service';

@Injectable()
export class MentalHealthService {
    constructor(
        @Inject('IMoodLogRepository') private moodLogRepository: IMoodLogRepository,
        private ragService: RagService
    ) { }

    async logMood(dto: any): Promise<MoodLog> {
        // Mock Sentiment Analysis
        const sentiment = this.analyzeSentiment(dto.journalNote);
        const newLog = new MoodLog({ ...dto, sentiment });
        const savedLog = await this.moodLogRepository.create(newLog);

        // Ingest into RAG
        await this.ragService.ingestMoodLogs([{
            id: savedLog.id,
            userId: savedLog.userId,
            moodScore: savedLog.moodScore,
            date: savedLog.date,
            note: savedLog.journalNote || ''
        }]);

        return savedLog;
    }

    async syncWithAi(userId: string) {
        const logs = await this.moodLogRepository.findAllByUserId(userId);
        const ragDocs = logs.map(log => ({
            id: log.id,
            userId: log.userId,
            moodScore: log.moodScore,
            date: log.date,
            note: log.journalNote || ''
        }));
        await this.ragService.ingestMoodLogs(ragDocs);
        return { count: logs.length, message: "Synced with AI Vector Store" };
    }

    async findAll(userId: string): Promise<MoodLog[]> {
        return this.moodLogRepository.findAllByUserId(userId);
    }

    private analyzeSentiment(text: string): string {
        if (!text) return 'Neutral';
        const positives = ['good', 'happy', 'great', 'awesome', 'excited'];
        const negatives = ['bad', 'sad', 'tired', 'angry', 'stressed'];

        let score = 0;
        text.toLowerCase().split(' ').forEach(word => {
            if (positives.includes(word)) score++;
            if (negatives.includes(word)) score--;
        });

        if (score > 0) return 'Positive';
        if (score < 0) return 'Negative';
        return 'Neutral';
    }
}

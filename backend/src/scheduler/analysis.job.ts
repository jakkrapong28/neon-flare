import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FinanceService } from '../finance/finance.service';
import { MentalHealthService } from '../mental-health/mental-health.service';
import { RagService } from '../ai/rag.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AnalysisJob {
    private readonly logger = new Logger(AnalysisJob.name);

    constructor(
        private readonly financeService: FinanceService,
        private readonly mentalHealthService: MentalHealthService,
        private readonly ragService: RagService,
        private readonly usersService: UsersService,
    ) { }

    // Run every Sunday at midnight
    @Cron(CronExpression.EVERY_WEEK)
    async handleWeeklyAnalysis() {
        this.logger.log('Running Weekly Spending & Mood Analysis...');

        // Ideally, fetch all users. For prototype, we'll iterate or just pick a main one.
        // Let's assume we find all users.
        try {
            const users = await this.usersService.findAll();
            for (const user of users) {
                await this.analyzeUser(user.id);
            }
        } catch (e) {
            this.logger.error('Failed to run weekly analysis', e);
        }
    }

    private async analyzeUser(userId: string) {
        // 1. Fetch Weekly Data
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // We need methods to get specific date ranges. 
        // Assuming Services have evolved or we use generic fetchers.
        // For now, let's use what we have or generic "recent" data.

        // Re-using correlation logic via LLM
        // We'll ask RAG to look at recent logs and summary.

        const prompt = `
            Analyze the correlation between the user's spending and mood over the last 7 days for UserId: ${userId}.
            Look for patterns like "stress spending" or "retail therapy".
            Provide a concise 3-sentence summary of your findings.
        `;

        const analysis = await this.ragService.query(prompt, userId);

        this.logger.log(`Analysis for ${userId}: ${analysis}`);

        // In a real app, we would save this to a Notification or Insight model.
        // For now, we ingest it back into RAG so the user can ask about it later!
        await this.ragService.ingestFinancialSummary(`Weekly AI Analysis: ${analysis}`, userId);
    }
}

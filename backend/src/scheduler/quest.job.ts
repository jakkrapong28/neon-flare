import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MentalHealthService } from '../mental-health/mental-health.service';
import { ProductivityService } from '../productivity/productivity.service';
import { RagService } from '../ai/rag.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class QuestJob {
    private readonly logger = new Logger(QuestJob.name);

    constructor(
        private readonly mentalHealthService: MentalHealthService,
        private readonly productivityService: ProductivityService,
        private readonly ragService: RagService,
        private readonly usersService: UsersService,
    ) { }

    // Run every day at 6:00 AM
    @Cron('0 6 * * *')
    async handleDailyQuest() {
        this.logger.log('Generating Daily Quests...');
        const users = await this.usersService.findAll();
        for (const user of users) {
            await this.generateQuest(user.id);
        }
    }

    private async generateQuest(userId: string) {
        // 1. Get recent energy/mood
        const logs = await this.mentalHealthService.findAll(userId);
        let energyLevel = 'Neutral';
        if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];
            if (lastLog.energyScore >= 8) energyLevel = 'High';
            else if (lastLog.energyScore <= 4) energyLevel = 'Low';
        }

        // 2. Ask AI for a quest
        const prompt = `
            Generate a single "Daily Quest" for a user with ${energyLevel} energy.
            If High Energy: Suggest a challenging productivity or fitness task (e.g., "Deep work for 2 hours" or "Run 5k").
            If Low Energy: Suggest a recovery or small-win task (e.g., "Read for 15 mins" or "Meditate").
            Format: Just the quest title. No quotes.
        `;

        const questTitle = await this.ragService.ask(prompt);

        // 3. Create Task
        await this.productivityService.createTask({
            userId,
            title: `⚔️ Quest: ${questTitle}`,
            status: 'TODO',
            isImportant: true, // Quests are special!
            isUrgent: false,
        });

        this.logger.log(`Generated Quest for ${userId}: ${questTitle}`);
    }
}

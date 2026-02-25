import { Injectable } from '@nestjs/common';
import { FinanceService } from '../finance/finance.service';
import { ProductivityService } from '../productivity/productivity.service';
import { MentalHealthService } from '../mental-health/mental-health.service';
import { HealthService } from '../health/health.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class AnalyticsService {
    constructor(
        private financeService: FinanceService,
        private productivityService: ProductivityService,
        private mentalHealthService: MentalHealthService,
        private healthService: HealthService,
        private geminiService: GeminiService,
    ) { }

    async getLifeBalance(userId: string) {
        // 1. Finance (0-150)
        const transactions = await this.financeService.getWeeklyCashFlow(userId);
        let financeScore = 80; // Baseline
        const totalIncome = transactions.reduce((sum, t) => sum + t.income, 0);
        const totalExpense = transactions.reduce((sum, t) => sum + t.expense, 0);

        if (totalIncome > totalExpense) financeScore += 30; // Positive Flow
        if (totalExpense > 0 && (totalIncome - totalExpense) / totalIncome > 0.2) financeScore += 40; // Good Savings Rate
        if (financeScore > 150) financeScore = 150;

        // 2. Work (0-150)
        const tasks = await this.productivityService.findAllTasks(userId);
        let workScore = 70;
        if (tasks && tasks.length > 0) {
            const completed = tasks.filter((t: any) => t.status === 'DONE').length;
            const rate = completed / tasks.length;
            workScore = Math.round(rate * 150);
        } else {
            workScore = 100; // No tasks = "Good" management
        }

        // 3. Mental (0-150) - Formerly Soul
        const journal = await this.mentalHealthService.findAll(userId);
        let mentalScore = 85;
        if (journal && journal.length > 0) {
            const recent = journal.slice(-5);
            const avgMood = recent.reduce((sum: number, j: any) => sum + j.moodScore, 0) / recent.length;
            mentalScore = Math.round((avgMood / 10) * 150);
        }

        // 4. Knowledge (0-150) - Placeholder for now
        let knowledgeScore = 90;

        // 5. Health (0-150) - Combined Physical & Rest
        const healthLogs = await this.healthService.getHistory(userId);
        let healthScore = 70;
        if (healthLogs && healthLogs.length > 0) {
            healthScore = 80 + (healthLogs.length * 10);
            if (healthScore > 150) healthScore = 150;
        }

        return [
            { subject: 'การเงิน (Finance)', A: financeScore, fullMark: 150 },
            { subject: 'งาน (Work)', A: workScore, fullMark: 150 },
            { subject: 'จิตใจ (Mental)', A: mentalScore, fullMark: 150 },
            { subject: 'ความรู้ (Knowledge)', A: knowledgeScore, fullMark: 150 },
            { subject: 'สุขภาพ (Health)', A: healthScore, fullMark: 150 },
        ];
    }

    async getDailySummary(userId: string) {
        // 1. Gather Data
        const transactions = await this.financeService.findAllTransactions(userId);
        const tasks = await this.productivityService.findAllTasks(userId);
        const journal = await this.mentalHealthService.findAll(userId);

        // 2. Prepare Context (Handle Empty States)
        const hasData = transactions.length > 0 || tasks.length > 0 || journal.length > 0;

        if (!hasData) {
            return { summary: "ยินดีต้อนรับ! เริ่มต้นวันใหม่ด้วยการบันทึกข้อมูลการเงินหรืองานของคุณ เพื่อให้ AI ช่วยวิเคราะห์และวางแผนชีวิตให้ดียิ่งขึ้นครับ ✨" };
        }

        const context = {
            user: {
                name: "Lucifer", // Ideally fetched from user profile, but requested hardcode check
            },
            finance: {
                netWorth: 3855, // Mock current if not calculating all
                transactionCount: transactions.length,
                recent: transactions.slice(-5)
            },
            tasks: {
                pending: tasks ? tasks.filter((t: any) => t.status !== 'DONE').length : 0,
                topPriority: tasks ? tasks.filter((t: any) => t.priority === 'urgent').map((t: any) => t.title) : []
            },
            journal: {
                latestMood: journal && journal.length > 0 ? journal[journal.length - 1].moodScore : 'Neutral'
            }
        };

        // 3. Ask Gemini
        const summary = await this.geminiService.generateDailyInsight(context);
        return { summary };
    }
}

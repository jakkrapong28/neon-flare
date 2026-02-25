import { Injectable } from '@nestjs/common';
import { FinanceService } from '../finance/finance.service';
import { ProductivityService } from '../productivity/productivity.service';
import { MentalHealthService } from '../mental-health/mental-health.service';

export interface LifeStatusResponse {
    scores: {
        soul: number;
        wealth: number;
        power: number;
    };
    state: 'SUPER NEON' | 'STABLE' | 'LOW BATTERY' | 'CRISIS';
    recommendedAction: string;
}

@Injectable()
export class LifeStateService {
    constructor(
        private readonly financeService: FinanceService,
        private readonly productivityService: ProductivityService,
        private readonly mentalHealthService: MentalHealthService,
    ) { }

    async getLifeStatus(userId: string, date: Date = new Date()): Promise<LifeStatusResponse> {
        // --- 1. Soul Score (Mental Health) ---
        // Logic: Avg MoodScore of last 7 days from `date`
        const sevenDaysAgo = new Date(date);
        sevenDaysAgo.setDate(date.getDate() - 7);

        const allLogs = await this.mentalHealthService.findAll(userId);
        const weeklyLogs = allLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= sevenDaysAgo && logDate <= date;
        });

        let soulScore = 60; // Default fallback (Optimistic)
        if (weeklyLogs.length > 0) {
            const sumMood = weeklyLogs.reduce((acc, log) => acc + log.moodScore, 0);
            const avgMood = sumMood / weeklyLogs.length;
            soulScore = Math.min(100, Math.round(avgMood * 10) + 20); // Scale up a bit (Mood 5/10 -> 70%)
        }

        // --- 2. Wealth Score (Finance) ---
        // Logic: (Cashflow / Income Goal) * 100
        const weeklyFlow = await this.financeService.getWeeklyCashFlow(userId);
        const totalIncome = weeklyFlow.reduce((acc, day) => acc + day.income, 0);
        const totalExpense = weeklyFlow.reduce((acc, day) => acc + day.expense, 0);
        const cashflow = totalIncome - totalExpense;

        const goals = await this.financeService.findAllGoals(userId);
        const incomeGoal = goals.find(g => g.type === 'INCOME' || g.name.toLowerCase().includes('income'))?.targetAmount || 10000;

        let wealthScore = 50;
        if (cashflow >= 0) {
            wealthScore = 50 + Math.min(50, Math.round((cashflow / incomeGoal) * 50));
        } else {
            // Soft penalty for negative cashflow
            wealthScore = Math.max(10, 50 - Math.round((Math.abs(cashflow) / incomeGoal) * 30));
        }

        // --- 3. Power Score (Productivity) ---
        // Logic: (Tasks Done / Total RELEVANT Tasks) * 100
        // RELEVANT = Created or Completed in the last 7 days
        const allTasks = await this.productivityService.findAllTasks(userId);
        const relevantTasks = allTasks.filter(t => {
            const updated = new Date(t.updatedAt);
            const created = new Date(t.createdAt);
            // Include if updated recently (completed or modified) OR created recently
            return updated >= sevenDaysAgo || created >= sevenDaysAgo;
        });

        let powerScore = 50;
        if (relevantTasks.length > 0) {
            const doneCount = relevantTasks.filter(t => t.status === 'DONE').length;
            powerScore = Math.round((doneCount / relevantTasks.length) * 100);
        } else {
            // If no tasks this week, assume taking a break or maintenance -> 60
            powerScore = 60;
        }

        // --- State Engine ---
        let state: LifeStatusResponse['state'] = 'STABLE';
        let action = "Maintain balance.";

        const scores = { soul: soulScore, wealth: wealthScore, power: powerScore };
        const minScore = Math.min(soulScore, wealthScore, powerScore);
        const avgScore = (soulScore + wealthScore + powerScore) / 3;

        if (minScore >= 80 && avgScore >= 85) {
            state = 'SUPER NEON';
            action = "Peak performance achievement unlocked. Transcend limits.";
        } else if (minScore < 30) {
            // Only trigger CRISIS if strictly below 30 on any metric
            state = 'CRISIS';
            action = "Critical failure imminent. Immediate intervention required on lowest metric.";
        } else if (avgScore < 50) {
            state = 'LOW BATTERY';
            action = "Energy reserves critical. Initiate recovery protocols.";
        } else {
            state = 'STABLE';
            action = "Systems operating within nominal parameters.";
        }

        return {
            scores,
            state,
            recommendedAction: action
        };
    }
}

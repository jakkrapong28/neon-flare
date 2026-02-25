import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalysisJob } from './analysis.job';
import { QuestJob } from './quest.job';
import { FinanceModule } from '../finance/finance.module';
import { MentalHealthModule } from '../mental-health/mental-health.module';
import { ProductivityModule } from '../productivity/productivity.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        FinanceModule,
        MentalHealthModule,
        ProductivityModule,
        UsersModule
    ],
    providers: [AnalysisJob, QuestJob],
})
export class SchedulerModule { }

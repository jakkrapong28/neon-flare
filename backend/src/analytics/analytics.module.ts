import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

import { FinanceModule } from '../finance/finance.module';
import { ProductivityModule } from '../productivity/productivity.module';
import { MentalHealthModule } from '../mental-health/mental-health.module';
import { HealthModule } from '../health/health.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    FinanceModule,
    ProductivityModule,
    MentalHealthModule,
    HealthModule,
    AiModule
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule { }

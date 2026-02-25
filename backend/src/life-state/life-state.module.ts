import { Module } from '@nestjs/common';
import { LifeStateController } from './life-state.controller';
import { LifeStateService } from './life-state.service';
import { FinanceModule } from '../finance/finance.module';
import { ProductivityModule } from '../productivity/productivity.module';
import { MentalHealthModule } from '../mental-health/mental-health.module';

@Module({
  imports: [
    FinanceModule,
    ProductivityModule,
    MentalHealthModule
  ],
  controllers: [LifeStateController],
  providers: [LifeStateService],
  exports: [LifeStateService],
})
export class LifeStateModule { }

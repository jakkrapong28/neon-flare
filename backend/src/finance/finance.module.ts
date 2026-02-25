import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Transaction, TransactionSchema } from './infrastructure/schemas/transaction.schema';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { Budget, BudgetSchema } from './schemas/budget.schema';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';
import { Goal, GoalSchema } from './schemas/goal.schema';
import { OcrService } from './ocr.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Goal.name, schema: GoalSchema },
    ]),
  ],
  controllers: [FinanceController],
  providers: [
    FinanceService,
    OcrService,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository
    }
  ],
  exports: [FinanceService]
})
export class FinanceModule { }

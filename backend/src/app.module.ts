import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FinanceModule } from './finance/finance.module';
import { ProductivityModule } from './productivity/productivity.module';
import { MentalHealthModule } from './mental-health/mental-health.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { HealthModule } from './health/health.module';
import { LifeStateModule } from './life-state/life-state.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        minPoolSize: 0,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FinanceModule,
    ProductivityModule,
    MentalHealthModule,
    AnalyticsModule,
    AiModule,
    KnowledgeModule,
    HealthModule,
    LifeStateModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

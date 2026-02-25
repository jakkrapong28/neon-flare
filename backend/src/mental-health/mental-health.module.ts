import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MentalHealthController } from './mental-health.controller';
import { MentalHealthService } from './mental-health.service';
import { MoodLog, MoodLogSchema } from './infrastructure/schemas/mood-log.schema';
import { MoodLogRepository } from './infrastructure/repositories/mood-log.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MoodLog.name, schema: MoodLogSchema }])
  ],
  controllers: [MentalHealthController],
  providers: [
    MentalHealthService,
    {
      provide: 'IMoodLogRepository',
      useClass: MoodLogRepository
    }
  ],
  exports: [MentalHealthService]
})
export class MentalHealthModule { }

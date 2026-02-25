import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeminiService } from './gemini.service';
import { RagService } from './rag.service';
import { AiController } from './ai.controller';
import { MoodLog, MoodLogSchema } from '../mental-health/infrastructure/schemas/mood-log.schema';
import { LifeStateModule } from '../life-state/life-state.module';

import { ProductivityModule } from '../productivity/productivity.module';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: MoodLog.name, schema: MoodLogSchema }]),
        LifeStateModule,
        ProductivityModule
    ],
    controllers: [AiController],
    providers: [GeminiService, RagService],
    exports: [GeminiService, RagService],
})
export class AiModule { }

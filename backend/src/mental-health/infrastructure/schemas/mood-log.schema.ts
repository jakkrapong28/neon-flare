import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MoodLogDocument = HydratedDocument<MoodLog>;

@Schema()
export class MoodLog {
    @Prop({ required: true })
    userId: string;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ required: true, min: 1, max: 10 })
    moodScore: number;

    @Prop({ required: true, min: 1, max: 10 })
    energyScore: number;

    @Prop()
    sleepHours: number;

    @Prop()
    journalNote: string;

    @Prop()
    sentiment: string; // Positive, Neutral, Negative

    @Prop({ type: [Number], index: true })
    embedding: number[];
}

export const MoodLogSchema = SchemaFactory.createForClass(MoodLog);

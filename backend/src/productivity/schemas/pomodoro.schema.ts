import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PomodoroSessionDocument = HydratedDocument<PomodoroSession>;

@Schema()
export class PomodoroSession {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    taskId: string; // Optional: Link to specific task

    @Prop({ required: true })
    durationMinutes: number;

    @Prop({ default: Date.now })
    completedAt: Date;

    @Prop()
    context: string; // "Coding", "Deep Work"
}

export const PomodoroSessionSchema = SchemaFactory.createForClass(PomodoroSession);

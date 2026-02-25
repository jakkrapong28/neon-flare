import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HealthDocument = Health & Document;

@Schema({ timestamps: true })
export class Health {
    @Prop({ required: true })
    userId: string;

    @Prop({ default: Date.now })
    date: Date;

    // Habits (Boolean map)
    @Prop({ type: Object })
    habits: Record<string, boolean>;

    // Workout
    @Prop()
    workoutType: string;

    @Prop()
    workoutDuration: number; // minutes

    @Prop()
    caloriesBurned: number;
}

export const HealthSchema = SchemaFactory.createForClass(Health);

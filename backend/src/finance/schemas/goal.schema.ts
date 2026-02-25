import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoalDocument = HydratedDocument<Goal>;

@Schema()
export class Goal {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false, enum: ['SAVING', 'DEBT'], default: 'SAVING' })
    type: string;

    @Prop({ required: true })
    targetAmount: number;

    @Prop({ required: true, default: 0 })
    currentAmount: number;

    @Prop()
    deadline: Date;

    @Prop({ default: '#10b981' }) // Emerald for saving, Red for debt usually
    color: string;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);

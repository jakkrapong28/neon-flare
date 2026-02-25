import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema()
export class Budget {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    limit: number;

    @Prop({ default: 'MONTHLY' })
    period: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

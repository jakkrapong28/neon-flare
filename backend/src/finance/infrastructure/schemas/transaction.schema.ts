import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: ['INCOME', 'EXPENSE'] })
    type: string;

    @Prop({ required: true })
    category: string;

    @Prop({ default: Date.now })
    date: Date;

    @Prop()
    description: string;

    @Prop()
    moodSnapshot?: string; // Optional: Link to mood at the time
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

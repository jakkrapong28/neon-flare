import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema()
export class Subscription {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, default: 'MONTHLY' }) // MONTHLY, YEARLY
    billingCycle: string;

    @Prop({ required: true })
    nextBillingDate: Date;

    @Prop({ default: true })
    isActive: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

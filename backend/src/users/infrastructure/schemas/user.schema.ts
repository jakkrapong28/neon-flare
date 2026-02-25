import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop()
    lastLogin: Date;

    @Prop([String])
    deviceFingerprints: string[];

    @Prop({ type: Object, default: {} })
    settings: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

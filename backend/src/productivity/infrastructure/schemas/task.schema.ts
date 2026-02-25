import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    deadline: Date;

    @Prop({ default: false })
    isImportant: boolean;

    @Prop({ default: false })
    isUrgent: boolean;

    @Prop({ required: true, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' })
    status: string;

    @Prop([String])
    tags: string[]; // e.g., "Coding", "Document"
}

export const TaskSchema = SchemaFactory.createForClass(Task);

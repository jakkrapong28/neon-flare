import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KnowledgeDocument = Knowledge & Document;

@Schema({ timestamps: true })
export class Knowledge {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true }) // 'note' or 'link'
    type: string;

    @Prop()
    content: string;

    @Prop()
    url: string; // For links

    @Prop([String])
    tags: string[];

    @Prop()
    summary: string; // AI Summary
}

export const KnowledgeSchema = SchemaFactory.createForClass(Knowledge);

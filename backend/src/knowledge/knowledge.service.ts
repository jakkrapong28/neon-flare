import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Knowledge, KnowledgeDocument } from './schemas/knowledge.schema';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class KnowledgeService {
    constructor(
        @InjectModel(Knowledge.name) private knowledgeModel: Model<KnowledgeDocument>,
        private geminiService: GeminiService
    ) { }

    async create(createKnowledgeDto: any): Promise<Knowledge> {
        // If type is link, try to summarize (Mocking summarize for now or generic text gen)
        if (createKnowledgeDto.type === 'link' && createKnowledgeDto.url) {
            // In real app, we'd fetch URL content here. 
            // For now, we'll just ask Gemini to summarize the URL string or title context
            // or assume client sends some context.
            // Let's just mock a "Planning to read" summary or similar if content is empty.
            if (!createKnowledgeDto.summary) {
                createKnowledgeDto.summary = "AI Summary pending...";
            }
        }
        const created = new this.knowledgeModel(createKnowledgeDto);
        return created.save();
    }

    async findAll(userId: string): Promise<Knowledge[]> {
        return this.knowledgeModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
}

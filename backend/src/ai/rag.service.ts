import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { MoodLog, MoodLogDocument } from '../mental-health/infrastructure/schemas/mood-log.schema';

export interface MoodLogDoc {
    id: string;
    userId: string;
    note: string;
    moodScore: number;
    date: Date;
}

@Injectable()
export class RagService {
    private model: ChatGroq;
    private embeddings: GoogleGenerativeAIEmbeddings;

    constructor(
        private configService: ConfigService,
        @InjectModel(MoodLog.name) private moodLogModel: Model<MoodLogDocument>
    ) { }

    private ensureInitialized() {
        if (this.model && this.embeddings) return;

        console.log("Initializing AI Models on-demand...");
        const groqKey = this.configService.get<string>('GROQ_API_KEY');
        if (groqKey && !this.model) {
            this.model = new ChatGroq({
                apiKey: groqKey,
                model: "llama-3.3-70b-versatile",
                temperature: 0.2
            });
        }

        const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (geminiKey && !this.embeddings) {
            this.embeddings = new GoogleGenerativeAIEmbeddings({
                apiKey: geminiKey,
                modelName: "embedding-001",
            });
        }
    }

    async ingestMoodLogs(logs: MoodLogDoc[]) {
        this.ensureInitialized();
        if (!this.embeddings) return;

        console.log(`Ingesting ${logs.length} mood logs...`);

        for (const log of logs) {
            const content = `Date: ${new Date(log.date).toISOString().split('T')[0]}. Mood Score: ${log.moodScore}/10. Note: ${log.note}`;

            try {
                // Generate embedding for the content
                const vector = await this.embeddings.embedQuery(content);

                // Update the document in MongoDB with the embedding
                await this.moodLogModel.updateOne(
                    { _id: log.id },
                    { $set: { embedding: vector } }
                );
            } catch (error) {
                console.error(`Failed to ingest log ${log.id}:`, error);
            }
        }
        console.log("Ingestion complete.");
    }

    async ingestFinancialSummary(summary: string, userId: string) {
        console.warn("ingestFinancialSummary is temporarily disabled during migration to MongoDB Vector Search.");
    }

    async query(question: string, userId: string): Promise<string> {
        this.ensureInitialized();
        if (!this.embeddings || !this.model) {
            return "AI services are currently unavailable (Missing API Keys).";
        }

        try {
            // Generate query vector
            const queryVector = await this.embeddings.embedQuery(question);

            // Vector Search Aggregation
            const results = await this.moodLogModel.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryVector,
                        numCandidates: 100,
                        limit: 10,
                    }
                },
                {
                    $match: {
                        userId: userId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: 1,
                        moodScore: 1,
                        journalNote: 1,
                        score: { $meta: "vectorSearchScore" }
                    }
                }
            ]);

            const context = results.map(doc =>
                `Date: ${new Date(doc.date).toISOString().split('T')[0]}. Mood Score: ${doc.moodScore}/10. Note: ${doc.journalNote}`
            ).join("\n\n");

            // Custom Prompt
            const template = `Answer the question based strictly on the following context. 
            The context contains personal mood logs.
            If the answer is not in the context, say "I don't have enough information in your journals."
    
            Context:
            {context}
    
            Question: {question}
            
            Answer:`;

            const prompt = PromptTemplate.fromTemplate(template);

            const chain = RunnableSequence.from([
                prompt,
                this.model,
                new StringOutputParser()
            ]);

            return await chain.invoke({
                context: context,
                question: question
            });

        } catch (error) {
            console.error("Vector Search Error:", error);
            return "An error occurred while retrieving information.";
        }
    }

    async ask(prompt: string): Promise<string> {
        this.ensureInitialized();
        if (!this.model) {
            return "Analysis Unavailable (Missing API Key)";
        }
        const chain = RunnableSequence.from([
            this.model,
            new StringOutputParser()
        ]);
        return await chain.invoke(prompt);
    }

    async chatWithLifeStatus(question: string, context: any, tasks: any[] = []): Promise<string> {
        this.ensureInitialized();
        if (!this.model) {
            console.error("RAG Service Error: ChatGroq model is not initialized.");
            return "ระบบ AI ยังไม่พร้อมใช้งาน (Model Error)";
        }

        try {
            const taskSummary = tasks.length > 0
                ? tasks.map(t => `- [${t.priority}] ${t.title} (Due: ${t.deadline})`).join('\n')
                : "No pending tasks.";

            const systemPrompt = `You are "Neon" (นีออน), an advanced Life OS AI Assistant.
        You are speaking to your user, "Khun Tony" (คุณโทนี่).
        
        Current System Status (Context):
        - Date: ${new Date().toLocaleDateString('th-TH')}
        - Soul Score (Mental): ${context.scores.soul}
        - Wealth Score (Finance): ${context.scores.wealth}
        - Power Score (Productivity): ${context.scores.power}
        - Overall State: ${context.state}
        - Recommended Action: ${context.recommendedAction}

        Pending Tasks (Urgent):
        ${taskSummary}

        User Question: ${question}

        Directives:
        1. **Strictly speak Thai** (ภาษาไทย 100%).
        2. Persona: "Neon" (นีออน) - Witty, loyal, helpful, slightly proactive using "ผม".
        3. If user asks "what to do", refer to Pending Tasks first, then Life Status.
        4. Use context to give specific advice based on scores.
        5. Keep answers concise (< 3 sentences usually).
        6. Use emojis (⚡, 🔮, 🚀) freely to match the Neon theme.
        `;

            const chain = RunnableSequence.from([
                this.model,
                new StringOutputParser()
            ]);

            return await chain.invoke(systemPrompt);
        } catch (error) {
            console.error("RAG Chat Error:", error);
            return "เกิดข้อผิดพลาดในการประมวลผลคำตอบ (Processing Error)";
        }
    }
}

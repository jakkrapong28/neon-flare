import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';
import Groq from 'groq-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OcrService {
    private groq: Groq;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        if (apiKey) {
            this.groq = new Groq({ apiKey });
        } else {
            console.warn("GROQ_API_KEY is missing. OCR Service will run in mock mode.");
        }
    }

    async parseSlip(imageBuffer: Buffer): Promise<any> {
        console.log("Processing Slip with Tesseract OCR...");

        try {
            const worker = await createWorker('eng'); // 'tha' if installed, but 'eng' is default safe
            // Tesseract might need Thai language data for Thai slips. 
            // For now, let's stick to basic engine or add 'tha' if user requested, but standard install might lack it.
            // Let's try 'eng+tha' if possible, or just 'eng' for numbers/dates which are usually common.
            // Actually, default createWorker() downloads trained data.

            const { data: { text } } = await worker.recognize(imageBuffer);
            await worker.terminate();

            console.log("Extracted Text:", text.substring(0, 100) + "...");

            // Pass to Llama-3.3 via Groq
            return await this.classifyWithLlama(text);

        } catch (error) {
            console.error("OCR/Groq Error:", error);
            // Fallback mock if keys missing or error
            if (!this.configService.get('GROQ_API_KEY')) {
                console.warn("GROQ_API_KEY not found. Returning mock data.");
                return this.getMockData();
            }
            throw new Error("Failed to process slip");
        }
    }

    private async classifyWithLlama(text: string): Promise<any> {
        if (!this.groq) {
            return this.getMockData();
        }
        try {
            const chatCompletion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an AI Helper extracting financial data from OCR text of receipts/slips.
                        Extract the following fields in JSON format:
                        - date (ISO format)
                        - amount (number)
                        - merchant (string)
                        - category (string, infer from items e.g., Food, Transport, Shopping, Utilities)
                        - items (array of strings, optional)
                        
                        Return ONLY raw JSON. No markdown formatting.
                        If date is missing, use today's date.`
                    },
                    {
                        role: "user",
                        content: `OCR Text:\n${text}`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
            });

            const content = chatCompletion.choices[0]?.message?.content || "{}";
            // Clean markdown code blocks if present
            const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return {
                success: true,
                data: JSON.parse(cleanJson)
            };
        } catch (error) {
            console.error("Llama-3.3 Extraction Error:", error);
            return { success: false, error: "AI Extraction Failed" };
        }
    }

    private getMockData() {
        return {
            success: true,
            data: {
                date: new Date(),
                amount: 123.45,
                merchant: "Mock Store",
                category: "General",
                transactionId: "MOCK123"
            }
        };
    }
}

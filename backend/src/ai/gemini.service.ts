import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private fallbackModel: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        // Primary: Gemini 2.0 Flash (v1beta)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
        // Fallback: Gemini 1.5 Flash
        this.fallbackModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    private async safeGenerate(prompt: string | any[]): Promise<any> {
        try {
            console.log("Attempting generation with Gemini 2.0 Flash...");
            return await this.model.generateContent(prompt);
        } catch (error) {
            console.warn("Gemini 2.0 failed. Falling back to 1.5 Flash.", error);
            try {
                return await this.fallbackModel.generateContent(prompt);
            } catch (fallbackError) {
                console.error("All Gemini models failed:", fallbackError);
                throw new Error("AI Service Unavailable");
            }
        }
    }

    async extractReceiptData(imageBuffer: Buffer, mimeType: string): Promise<any> {
        try {
            const prompt = `
            Extract the following data from this receipt/slip image and return it in JSON format ONLY (no markdown code blocks):
            - amount (number)
            - date (ISO 8601 string, guess current year if missing)
            - category (string, one of: food, transport, shopping, bill, salary, freelance, other)
            - merchant (string, name of shop or person)
            - note (string, brief description)
            
            If you cannot determine the category, guess based on merchant.
            If image is not a receipt, return error field.
            `;

            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType,
                },
            };

            const result = await this.safeGenerate([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini receipt response:", e);
            return { error: "Failed to parse receipt data" };
        }
    }

    async analyzeFinancialHabits(transactions: any[]): Promise<string> {
        try {
            const prompt = `
            Analyze these financial transactions and provide a short, specific insight (1 sentence) followed by 3 bullet points of advice.
            Transactions: ${JSON.stringify(transactions)}
            Output format:
            Insight: [Your insight here]
            - [Advice 1]
            - [Advice 2]
            - [Advice 3]
            `;

            const result = await this.safeGenerate(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Analysis Error:", error);
            return "Unable to analyze financial habits at the moment.";
        }
    }

    async prioritizeTasks(tasks: any[]): Promise<any[]> {
        try {
            const prompt = `
            Prioritize these tasks using the Eisenhower Matrix. Return the same list of tasks but add a "priority" field (urgent, high, medium, low) and a "matrix_quadrant" field (Do First, Schedule, Delegate, Delete).
            Return JSON array.
            Tasks: ${JSON.stringify(tasks)}
            `;

            const result = await this.safeGenerate(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Gemini Task Priority Error:", e);
            return tasks;
        }
    }

    async generateDailyInsight(data: any): Promise<string> {
        try {
            const prompt = `
            You are "Neon" (นีออน), a futuristic, witty, and playful LifeOS AI Assistant. 
            You are speaking to your user, "Khun Tony" (คุณโทนี่).
            
            Synthesize the daily data into a short, engaging summary in Thai.
            
            Data:
            - Net Worth/Finance: ${JSON.stringify(data.finance)}
            - Pending Tasks: ${data.tasks?.length || 0} items
            - Mood/Journal: ${JSON.stringify(data.journal)}

            Persona Guidelines:
            - Language: Thai (Natural, modern, tech-savvy slang allowed).
            - Tone: Playful, slightly provocative but respectful, energetic.
            - Style: Use emojis related to neon/tech/future (⚡, 🔮, 🚀).
            
            Output format:
            One paragraph (max 3 sentences). Start with a hook. End with an actionable nudge.
            `;
            const result = await this.safeGenerate(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Daily Insight Error (Using Local Fallback):", error);

            // SMART LOCAL FALLBACK (No API Required)
            const income = data.finance?.recent?.filter((t: any) => t.type === 'INCOME').reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
            const expense = data.finance?.recent?.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
            const taskCount = data.tasks?.pending || 0;
            const energy = data.journal?.latestMood || 5;

            let moodStr = "สมดุล";
            if (income > expense * 1.5) moodStr = "รวยเละ";
            else if (expense > income * 0.8) moodStr = "กระเป๋าฉีก";

            let advice = "พักผ่อนบ้างนะครับคุณโทนี่";
            if (taskCount > 5) advice = "เคลียร์งานด่วนก่อนนะครับ เด๋วดินพอกหางหมู";
            else if (taskCount === 0) advice = "ว่างแล้วสินะ? หาความรู้ใส่ตัวเพิ่มหน่อยไหม?";

            return `⚡ [Offline Mode] วันนี้การเงินดู${moodStr} (บวก ${income - expense} บาท) แต่งานค้างอีก ${taskCount} อย่าง พลังงานเหลือ ${energy}/10... ${advice} 🚀`;
        }
    }
    async generateCrisisPlan(mode: string, context: any): Promise<string[]> {
        try {
            const prompt = `
            ROLE: Tactical LifeOS Commander.
            USER: Khun Tony (in CRISIS mode: ${mode.toUpperCase()}).
            CONTEXT: ${JSON.stringify(context)}
            
            OBJECTIVE: Generate exactly 3 immediate, specific, imperative commands to resolve the ${mode} crisis.
            
            RULES:
            1. No small talk. No empathy fluff. No "Please".
            2. Imperative verbs only (e.g., "Transfer", "Call", "Stop", "Sleep").
            3. Specifics over generalities (e.g., "Transfer 5000 to Vault" NOT "Save money").
            4. Thai or English mixed (Tone: Serious, Urgent, Professional).
            
            OUTPUT FORMAT:
            JSON Array of strings ONLY. Example: ["Transfer 5000 THB to Emergency Vault", "Cancel 4PM Meeting", "Drink 500ml Water"]
            `;

            const result = await this.safeGenerate(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean markdown
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Gemini Crisis Plan Error:", error);
            return [
                "System Offline. Assess manually.",
                "Breathe deeply.",
                "Check basic needs (Water, Food, Sleep)."
            ];
        }
    }
}

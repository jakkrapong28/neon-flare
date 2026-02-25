import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { RagService } from './rag.service';
import { AuthGuard } from '@nestjs/passport';
import { LifeStateService } from '../life-state/life-state.service';
import { ProductivityService } from '../productivity/productivity.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly ragService: RagService,
        private readonly lifeStateService: LifeStateService,
        private readonly productivityService: ProductivityService
    ) { }

    @Post('insight')
    async getDailyInsight(@Body() body: any) {
        return this.geminiService.generateDailyInsight(body);
    }

    @Post('query')
    async query(@Body() body: { question: string }, @Request() req: any) {
        return { answer: await this.ragService.query(body.question, req.user.userId) };
    }

    @Post('chat')
    async chat(@Body() body: { message: string, date?: string }, @Request() req: any) {
        try {
            const date = body.date ? new Date(body.date) : new Date();
            const userId = req.user.userId;

            // Parallel Fetching for Performance
            const [lifeStatus, tasks] = await Promise.all([
                this.lifeStateService.getLifeStatus(userId, date),
                this.productivityService.findAllTasks(userId)
            ]);

            // Filter only pending/relevant tasks to save context window
            const pendingTasks = tasks.filter(t => t.status !== 'DONE').map(t => ({
                title: t.title,
                priority: t.isUrgent && t.isImportant ? 'Urgent & Important' :
                    t.isUrgent ? 'Urgent' :
                        t.isImportant ? 'Important' : 'Normal',
                deadline: t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No Deadline'
            }));

            const answer = await this.ragService.chatWithLifeStatus(body.message, lifeStatus, pendingTasks);
            return { response: answer };
        } catch (error) {
            console.error("Chat Error:", error);
            // Fallback for user
            return { response: "ระบบขัดข้องชั่วคราว (AI Error). กรุณาลองใหม่ภายหลัง" };
        }
    }
}

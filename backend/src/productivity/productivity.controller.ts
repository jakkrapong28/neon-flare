import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { ProductivityService } from './productivity.service';
import { AuthGuard } from '@nestjs/passport';
import { GeminiService } from '../ai/gemini.service';

@Controller('productivity')
@UseGuards(AuthGuard('jwt'))
export class ProductivityController {
    constructor(
        private readonly productivityService: ProductivityService,
        private readonly geminiService: GeminiService
    ) { }

    @Post('tasks')
    createTask(@Body() createTaskDto: any, @Request() req: any) {
        return this.productivityService.createTask({ ...createTaskDto, userId: req.user.userId });
    }

    @Get('tasks')
    findAllTasks(@Request() req: any) {
        return this.productivityService.findAllTasks(req.user.userId);
    }

    @Post('prioritize')
    async prioritizeTasks(@Body() body: { tasks: any[] }) {
        return await this.geminiService.prioritizeTasks(body.tasks);
    }
}

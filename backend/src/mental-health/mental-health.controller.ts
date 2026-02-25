import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { MentalHealthService } from './mental-health.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('mental-health')
@UseGuards(AuthGuard('jwt'))
export class MentalHealthController {
    constructor(private readonly mentalHealthService: MentalHealthService) { }

    @Post('journal')
    logMood(@Body() moodLogDto: any, @Request() req: any) {
        return this.mentalHealthService.logMood({ ...moodLogDto, userId: req.user.userId });
    }

    @Get('journal')
    findAll(@Request() req: any) {
        return this.mentalHealthService.findAll(req.user.userId);
    }

    @Post('sync-ai')
    syncAi(@Request() req: any) {
        return this.mentalHealthService.syncWithAi(req.user.userId);
    }
}

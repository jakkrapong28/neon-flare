import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('summary')
    getSummary(@Request() req: any) {
        return this.analyticsService.getDailySummary(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('life-balance')
    getLifeBalance(@Request() req: any) {
        return this.analyticsService.getLifeBalance(req.user.userId);
    }
}

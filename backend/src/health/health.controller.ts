import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { HealthService } from './health.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('health')
@UseGuards(AuthGuard('jwt'))
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @Post('log')
    log(@Body() body: any, @Request() req: any) {
        return this.healthService.logDaily(req.user.userId, body);
    }

    @Get('history')
    getHistory(@Request() req: any) {
        return this.healthService.getHistory(req.user.userId);
    }
}

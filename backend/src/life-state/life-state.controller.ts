import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common';
import { LifeStateService } from './life-state.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/life-OS')
@UseGuards(AuthGuard('jwt'))
export class LifeStateController {
    constructor(private readonly lifeStateService: LifeStateService) { }

    @Get('status')
    getLifeStatus(@Request() req: any, @Query('date') dateString?: string) {
        const date = dateString ? new Date(dateString) : new Date();
        return this.lifeStateService.getLifeStatus(req.user.userId, date);
    }
}

import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('knowledge')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeController {
    constructor(private readonly knowledgeService: KnowledgeService) { }

    @Post()
    create(@Body() createKnowledgeDto: any, @Request() req: any) {
        return this.knowledgeService.create({ ...createKnowledgeDto, userId: req.user.userId });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.knowledgeService.findAll(req.user.userId);
    }
}

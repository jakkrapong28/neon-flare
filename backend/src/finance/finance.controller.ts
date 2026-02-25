import { Controller, Get, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FinanceService } from './finance.service';
import { AuthGuard } from '@nestjs/passport';
import { GeminiService } from '../ai/gemini.service';

@Controller('finance')
@UseGuards(AuthGuard('jwt'))
export class FinanceController {
    constructor(
        private readonly financeService: FinanceService,
        private readonly geminiService: GeminiService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSlip(@UploadedFile() file: any) {
        if (!file) {
            return { error: 'No file uploaded' };
        }
        return await this.financeService.processSlip(file.buffer);
    }

    @Post('transactions')
    async createTransaction(@Body() createTransactionDto: any, @Request() req: any) {
        try {
            console.log('------------------------------------------------');
            console.log('🚀 API: Create Transaction Reached');
            console.log('👤 UserID:', req.user.userId);
            console.log('📦 Raw Payload:', JSON.stringify(createTransactionDto));

            // Fix Types & Casting
            if (createTransactionDto.type) {
                createTransactionDto.type = createTransactionDto.type.toUpperCase();
            }

            // Strictly validate Type
            const allowedTypes = ['INCOME', 'EXPENSE'];
            if (!allowedTypes.includes(createTransactionDto.type)) {
                // Default to EXPENSE if invalid or missing, or throw error.
                // Given "Validation Error" complaint, let's fix it by validating or defaulting.
                // Better to throw error if it's completely wrong, but maybe just default to EXPENSE for safety?
                // User said "Validation Error caused save failure".
                // Let's THROW if it's really bad, but ensure we catch it.
                // Wait, if it's "Validation Error", maybe backend is rejecting it? 
                // Let's default to EXPENSE if it's not INCOME/EXPENSE.
                if (!createTransactionDto.type) createTransactionDto.type = 'EXPENSE';
                else if (!allowedTypes.includes(createTransactionDto.type)) {
                    throw new Error(`Invalid Transaction Type: ${createTransactionDto.type}. Must be INCOME or EXPENSE`);
                }
            }

            if (createTransactionDto.amount) {
                createTransactionDto.amount = Number(createTransactionDto.amount); // Force Number
            }
            if (createTransactionDto.date) {
                createTransactionDto.date = new Date(createTransactionDto.date); // Force Date Object
            }

            console.log('✨ Processed Payload:', JSON.stringify(createTransactionDto));

            const result = await this.financeService.createTransaction({ ...createTransactionDto, userId: req.user.userId });
            console.log('✅ Saved to DB:', JSON.stringify(result));
            console.log('------------------------------------------------');
            return result;
        } catch (error) {
            console.error('❌ Create Transaction Error:', error);
            throw error;
        }
    }

    @Get('analysis')
    async getFinancialAnalysis(@Request() req: any) {
        const transactions = await this.financeService.findAllTransactions(req.user.userId);
        // Limit to last 50 transactions to avoid token limits
        const recentTransactions = transactions.slice(-50);
        return await this.geminiService.analyzeFinancialHabits(recentTransactions);
    }

    @Get('transactions')
    findAllTransactions(@Request() req: any) {
        return this.financeService.findAllTransactions(req.user.userId);
    }

    @Delete('transactions/:id')
    async deleteTransaction(@Param('id') id: string, @Request() req: any) {
        console.log(`🗑️ Deleting Transaction: ${id} for User: ${req.user.userId}`);
        return await this.financeService.deleteTransaction(id, req.user.userId);
    }

    @Post('budgets')
    createBudget(@Body() createBudgetDto: any, @Request() req: any) {
        return this.financeService.createBudget({ ...createBudgetDto, userId: req.user.userId });
    }

    @Get('budgets')
    findAllBudgets(@Request() req: any) {
        return this.financeService.findAllBudgets(req.user.userId);
    }
    @Get('burn-rate')
    async getBurnRate(@Request() req: any) {
        // Need current balance (net worth) to predict runway.
        // For now, let's calculate Net Worth dynamically from all transactions.
        const transactions = await this.financeService.findAllTransactions(req.user.userId);
        console.log(`📊 Analysis: Found ${transactions.length} transactions for User ${req.user.userId}`);

        const netWorth = transactions.reduce((acc, curr) => curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount, 0);
        console.log(`💰 Calculated Net Worth: ${netWorth}`);

        const burnRate = await this.financeService.calculateBurnRate(req.user.userId);
        const runway = await this.financeService.predictRunway(req.user.userId, netWorth);

        return { burnRate, runway, netWorth };
    }

    @Get('cash-flow')
    async getCashFlow(@Request() req: any) {
        return this.financeService.getWeeklyCashFlow(req.user.userId);
    }

    @Get('alerts')
    async getFinanceAlerts(@Request() req: any) {
        // Service now returns formatted alerts
        return this.financeService.checkUpcomingRenewals(req.user.userId);
    }

    @Post('subscriptions')
    createSubscription(@Body() dto: any, @Request() req: any) {
        return this.financeService.createSubscription({ ...dto, userId: req.user.userId });
    }

    @Get('subscriptions')
    findAllSubscriptions(@Request() req: any) {
        return this.financeService.findAllSubscriptions(req.user.userId);
    }

    @Delete('subscriptions/:id')
    deleteSubscription(@Param('id') id: string, @Request() req: any) {
        return this.financeService.deleteSubscription(id, req.user.userId);
    }

    // --- Goals ---
    @Post('goals')
    createGoal(@Body() dto: any, @Request() req: any) {
        // Validation for Goal Type
        if (dto.type) dto.type = dto.type.toUpperCase();

        // Map common "Income" goal to "SAVING" or reject if strictly following schema
        // Schema allows: SAVING, DEBT
        // If user sends 'INCOME' (common mistake if copied from Transaction), map to SAVING?
        // Or "WEALTH" -> SAVING.
        const allowed = ['SAVING', 'DEBT'];
        if (!dto.type || !allowed.includes(dto.type)) {
            // Smart fallback
            if (dto.type === 'INCOME' || dto.type === 'WEALTH' || dto.type === 'ASSET') {
                dto.type = 'SAVING';
            } else {
                dto.type = 'SAVING'; // Default to Saving if unknown
            }
        }

        return this.financeService.createGoal({ ...dto, userId: req.user.userId });
    }

    @Get('goals')
    findAllGoals(@Request() req: any) {
        return this.financeService.findAllGoals(req.user.userId);
    }

    @Delete('goals/:id')
    deleteGoal(@Param('id') id: string, @Request() req: any) {
        return this.financeService.deleteGoal(id, req.user.userId);
    }

    // Patch to update amount/progress
    @Post('goals/:id')
    updateGoal(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
        return this.financeService.updateGoal(id, req.user.userId, dto);
    }
}

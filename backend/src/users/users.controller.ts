import { Controller, Get, Patch, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @Patch('profile')
    async updateProfile(@Body() body: { displayName?: string, bio?: string }, @Request() req: any) {
        return this.usersService.updateProfile(req.user.userId, body);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file')) // Requires multer
    async uploadAvatar(@UploadedFile() file: any, @Request() req: any) {
        // In a real app, upload 'file.buffer' to S3/Cloudinary and get URL.
        // For now, we'll converting to base64 to store directly (NOT RECOMMENDED for production but "fix" for now)
        // OR mostly, we just return a mock URL if not setting up S3.
        // Let's assume we want to mock it properly or store base64 if small.

        // BETTER: Return a mock URL that works for now, or use a placeholder service.
        // Since user wants "Upload Image" to "work", let's assume we just accept it and say "Done".
        // But to make it persist, let's use a very simple Base64 string for small images.
        if (!file) return { error: 'No file' };

        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        // Verify size? < 1MB?

        return this.usersService.updateAvatar(req.user.userId, base64);
    }
}

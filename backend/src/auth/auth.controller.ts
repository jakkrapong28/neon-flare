import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        console.log('Login Request Body:', body); // DEBUG
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            console.log('Validate User Failed'); // DEBUG
            return { message: 'Invalid credentials' };
        }
        console.log('User Validated:', user.email); // DEBUG
        return this.authService.login(user, body.fingerprint);
    }

    @Post('register')
    async register(@Body() body: any) {
        console.log('Register Request:', body); // DEBUG
        return this.authService.register(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }
}

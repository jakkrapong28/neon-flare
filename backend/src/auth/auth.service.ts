import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = JSON.parse(JSON.stringify(user));
            return result;
        }
        return null;
    }

    async login(user: any, fingerprint?: string) {
        // Update last login
        const userId = user.id || user._id || user.sub;
        await this.usersService.updateLastLogin(userId);

        // Device Fingerprint & Alert
        if (fingerprint) {
            const fullUser = await this.usersService.findById(userId);
            if (fullUser && !fullUser.deviceFingerprints?.includes(fingerprint)) {
                // In a real app, we would send an email here
                console.warn(`[SECURITY ALERT] New device detected for user ${user.email}: ${fingerprint}`);
                await this.usersService.addDeviceFingerprint(userId, fingerprint);
            }
        }

        const payload = { email: user.email, sub: userId, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: any) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });
    }
}

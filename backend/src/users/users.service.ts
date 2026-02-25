import { Injectable, Inject } from '@nestjs/common';
import { User } from './domain/entities/user.entity';
import type { IUserRepository } from './domain/repositories/user.repository.interface';

@Injectable()
export class UsersService {
    constructor(@Inject('IUserRepository') private userRepository: IUserRepository) { }

    async create(createUserDto: any): Promise<User> {
        // Here we should map DTO to Entity props, but for now we pass DTO as partial
        // Ideally we should have a generic "create" in repo or factory
        const newUser = new User(createUserDto);
        return this.userRepository.create(newUser);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async findById(userId: string): Promise<User | null> {
        return this.userRepository.findById(userId);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userRepository.updateLastLogin(userId);
    }

    async addDeviceFingerprint(userId: string, fingerprint: string): Promise<void> {
        await this.userRepository.addDeviceFingerprint(userId, fingerprint);
    }

    async updateProfile(userId: string, updateData: { displayName?: string, bio?: string }): Promise<User | null> {
        return this.userRepository.update(userId, updateData);
    }

    async updateAvatar(userId: string, avatarUrl: string): Promise<User | null> {
        return this.userRepository.update(userId, { avatar: avatarUrl });
    }
}

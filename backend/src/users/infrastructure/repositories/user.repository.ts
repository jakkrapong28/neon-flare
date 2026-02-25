import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { User as UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) { }

    async create(user: User): Promise<User> {
        const createdUser = new this.userModel(user);
        const saved = await createdUser.save();
        return this.toEntity(saved);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).exec();
        return user ? this.toEntity(user) : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        return user ? this.toEntity(user) : null;
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        const updated = await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
        return updated ? this.toEntity(updated) : null;
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() });
    }

    async addDeviceFingerprint(id: string, fingerprint: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(id, { $addToSet: { deviceFingerprints: fingerprint } });
    }

    async findAll(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => this.toEntity(user));
    }

    private toEntity(document: any): User {
        return new User({
            id: document._id.toString(),
            name: document.name,
            email: document.email,
            password: document.password,
            roles: document.roles,
            createdAt: document.createdAt,
            lastLogin: document.lastLogin,
            deviceFingerprints: document.deviceFingerprints,
            settings: document.settings,
            avatar: document.avatar,
            bio: document.bio,
            displayName: document.displayName,
        });
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Health, HealthDocument } from './schemas/health.schema';

@Injectable()
export class HealthService {
    constructor(@InjectModel(Health.name) private healthModel: Model<HealthDocument>) { }

    async logDaily(userId: string, data: any): Promise<Health> {
        // Find if entry exists for today, else create
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const existing = await this.healthModel.findOne({
            userId,
            date: { $gte: startOfDay }
        });

        if (existing) {
            // Update existing
            if (data.habits) existing.habits = { ...existing.habits, ...data.habits };
            if (data.workoutType) existing.workoutType = data.workoutType;
            if (data.workoutDuration) existing.workoutDuration = data.workoutDuration;
            if (data.caloriesBurned) existing.caloriesBurned = data.caloriesBurned;
            return existing.save();
        } else {
            // Create new
            const newEntry = new this.healthModel({
                userId,
                date: new Date(),
                ...data
            });
            return newEntry.save();
        }
    }

    async getHistory(userId: string): Promise<Health[]> {
        return this.healthModel.find({ userId }).sort({ date: -1 }).limit(30).exec();
    }
}

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Task } from './domain/entities/task.entity';
import type { ITaskRepository } from './domain/repositories/task.repository.interface';
import { PomodoroSession } from './schemas/pomodoro.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductivityService {
    constructor(
        @Inject('ITaskRepository') private taskRepository: ITaskRepository,
        @InjectModel(PomodoroSession.name) private pomodoroModel: Model<PomodoroSession>,
        private httpService: HttpService
    ) { }

    async createTask(createTaskDto: any): Promise<Task> {
        return this.taskRepository.create(new Task(createTaskDto));
    }

    async findAllTasks(userId: string): Promise<Task[]> {
        return this.taskRepository.findAllByUserId(userId);
    }

    async getEisenhowerMatrix(userId: string) {
        const allTasks = await this.taskRepository.findAllByUserId(userId);
        const tasks = allTasks.filter(t => t.status !== 'DONE');

        return {
            doFirst: tasks.filter(t => t.isImportant && t.isUrgent),
            schedule: tasks.filter(t => t.isImportant && !t.isUrgent),
            delegate: tasks.filter(t => !t.isImportant && t.isUrgent),
            delete: tasks.filter(t => !t.isImportant && !t.isUrgent),
        };
    }

    async logPomodoro(sessionDto: any): Promise<PomodoroSession> {
        return new this.pomodoroModel(sessionDto).save();
    }

    async getGithubStreak(username: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(`https://api.github.com/users/${username}/events`));
            const events = response.data;
            // Check if pushed today
            const today = new Date().toDateString();
            const hasPushedToday = events.some((e: any) =>
                e.type === 'PushEvent' && new Date(e.created_at).toDateString() === today
            );
            return { hasPushedToday, eventCount: events.length };
        } catch (error) {
            return { hasPushedToday: false, error: 'Could not fetch GitHub data' };
        }
    }
}

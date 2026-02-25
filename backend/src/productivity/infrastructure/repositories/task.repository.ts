import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import { Task } from '../../domain/entities/task.entity';
import { Task as TaskDocument } from '../schemas/task.schema';

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(@InjectModel(TaskDocument.name) private taskModel: Model<TaskDocument>) { }

    async create(task: Task): Promise<Task> {
        const createdTask = new this.taskModel(task);
        const saved = await createdTask.save();
        return this.toEntity(saved);
    }

    async findAllByUserId(userId: string): Promise<Task[]> {
        const docs = await this.taskModel.find({ userId }).exec();
        return docs.map(doc => this.toEntity(doc));
    }

    async findById(id: string): Promise<Task | null> {
        const doc = await this.taskModel.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }

    async update(id: string, task: Partial<Task>): Promise<Task | null> {
        const updated = await this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
        return updated ? this.toEntity(updated) : null;
    }

    async delete(id: string): Promise<void> {
        await this.taskModel.findByIdAndDelete(id).exec();
    }

    async findByStatus(userId: string, status: string): Promise<Task[]> {
        const docs = await this.taskModel.find({ userId, status }).exec();
        return docs.map(doc => this.toEntity(doc));
    }

    private toEntity(doc: any): Task {
        return new Task({
            id: doc._id.toString(),
            userId: doc.userId,
            title: doc.title,
            status: doc.status,
            isImportant: doc.isImportant,
            isUrgent: doc.isUrgent,
            tags: doc.tags,
            deadline: doc.deadline,
        });
    }
}

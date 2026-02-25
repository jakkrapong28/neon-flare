import { Task } from '../entities/task.entity';

export interface ITaskRepository {
    create(task: Task): Promise<Task>;
    findAllByUserId(userId: string): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    update(id: string, task: Partial<Task>): Promise<Task | null>;
    delete(id: string): Promise<void>;
    findByStatus(userId: string, status: string): Promise<Task[]>;
}

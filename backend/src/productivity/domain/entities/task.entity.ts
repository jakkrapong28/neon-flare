export class Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    isImportant: boolean;
    isUrgent: boolean;
    tags?: string[];
    deadline?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Task>) {
        Object.assign(this, partial);
    }
}

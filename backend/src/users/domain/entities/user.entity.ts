export class User {
    id: string;
    name: string;
    email: string;
    password?: string;
    roles: string[];
    createdAt: Date;
    lastLogin?: Date;
    deviceFingerprints?: string[];
    settings?: Record<string, any>;
    avatar?: string;
    bio?: string;
    displayName?: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}

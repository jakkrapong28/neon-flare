export class MoodLog {
    id: string;
    userId: string;
    moodScore: number;
    energyScore: number;
    sleepHours?: number;
    journalNote?: string;
    sentiment?: string;
    date: Date;

    constructor(partial: Partial<MoodLog>) {
        Object.assign(this, partial);
    }
}

interface Score {
    id: string;
    volunteerId: string;
    participation: number;
    autonomy: number;
    proactivity: number;
    discipline: number;
    constancy: number;
    average: number;
    createdAt: Date;
    updatedAt: Date;
}
  
export interface Volunteer {
    id: string;
    name: string;
    active: boolean;
    scores: Score[];
    createdAt: Date;
    updatedAt: Date;
    lastScore?: Score;
    average?: number;
}
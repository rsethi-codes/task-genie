/**
 * User type matching the Prisma schema
 */
export interface User {
    id: string;
    clerkId: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    timeZone: string;
    locale: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    lastSeenAt: string | null;
    isActive: boolean;
    currentPersonaVersion: number;
    profile?: UserProfile;
}

export interface UserProfile {
    id: string;
    userId: string;
    defaultPriority: string;
    defaultDuration: number | null;
    workStartTime: string | null;
    workEndTime: string | null;
    preferredWorkDays: string[];
    breakDuration: number | null;
    customPreferences: any;
    integrations: any;
    createdAt: string;
    updatedAt: string;
}

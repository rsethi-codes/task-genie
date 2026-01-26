export enum NodeStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export enum NodeType {
    ROOT = 'ROOT',
    PHASE = 'PHASE',
    DAILY = 'DAILY',
    ACTION = 'ACTION',
    GUIDANCE = 'GUIDANCE'
}

export enum TemporalIntent {
    today = 'today',
    daily = 'daily',
    phase = 'phase',
    anytime = 'anytime'
}

export enum EnergyLevel {
    very_low = 'very_low',
    low = 'low',
    medium = 'medium',
    high = 'high',
    very_high = 'very_high'
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum ComplexityLevel {
    L0 = 'L0',
    L1 = 'L1',
    L2 = 'L2',
    L3 = 'L3'
}

export interface TaskComplexity {
    level: ComplexityLevel;
    confidenceScore: number;
    reasoning: string;
    decidedAt: string;
}

export interface TaskNode {
    id: string;
    userId: string;
    parentId: string | null;
    rootTaskId: string;
    title: string;
    description: string | null;
    nodeType: NodeType;
    status: NodeStatus;
    priority: Priority; // Added priority
    category: string | null; // Added category
    order: number;
    estimatedDuration: number | null;
    energyRequired: EnergyLevel | null;
    isCompletable: boolean;
    aiGenerated: boolean;
    aiMetadata: any;
    progressMeta: any;
    temporalIntent: TemporalIntent;
    dueDate?: string | null;
    actualDuration?: number; // Added actualDuration (PART 1 fix)
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    // Derived/Joined fields
    subtaskCount?: number;
    completedSubtasks?: number;
    aiGenerationStatus?: 'PENDING' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'FAILED';
    aiSuggested?: boolean;

    // UI-only recursive expansion
    children?: TaskNode[];

    // Legacy mapping (optional, for smoother migration)
    subtasks?: TaskNode[];

    complexity?: TaskComplexity;
}

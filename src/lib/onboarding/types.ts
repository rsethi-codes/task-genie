export type QuestionType = "text" | "choice";
export type QuestionImportance = "critical" | "important" | "optional";
export type QuestionEffort = "low" | "medium" | "high";

export interface EngagementSignals {
    responseTimeMs: number;
    editCount: number;
    hesitationCount: number; // typing start/stop
    answerLength: number;
    skipEvents: number;
    timeSpentInSessionMs: number;
    dropOffRisk: number; // 0 to 1
}

export interface OnboardingQuestion {
    id: string;
    text: string;
    type: QuestionType;
    options?: string[]; // For choice type
    importance: QuestionImportance;
    effort: QuestionEffort;
    rationale: string; // AI reasoning for this question
}

export interface PersonaSnapshot {
    version: number;
    timestamp: string;
    traits: Record<string, any>;
    confidence: number; // 0 to 1
}

export interface OnboardingContext {
    userId: string;
    currentPersona: PersonaSnapshot;
    previousAnswers: Record<string, any>;
    engagementHistory: EngagementSignals[];
}

export type AIDecision =
    | { type: "ask"; question: OnboardingQuestion }
    | { type: "end"; finalPersona: PersonaSnapshot };

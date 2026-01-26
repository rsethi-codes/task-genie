
export type CheckInStep = "ENERGY" | "MOOD" | "REFLECTION" | "PROCESSING" | "RESULT";

export interface CheckInState {
    energy: number;
    moods: string[];
    reflection: string;
}

export interface Recommendation {
    strategy: "rest" | "easy_win" | "focus" | "motivation";
    rationale: string;
    primaryAction: {
        text: string;
        nodeId?: string;
    };
    alternatives: Array<{
        text: string;
        nodeId?: string;
    }>;
}

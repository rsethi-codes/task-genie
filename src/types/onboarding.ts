export type QuestionType ="multiple-choice" | "rating" | "text" | "multi-select" | "scenario" | "slider" | "date";

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface QuestionsByCategory {
  [key: string]: Question
}
export interface Question {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  category: string;
  options?: string[];
  icon: React.ElementType;
  aiPrompt: string;
  validation?: ValidationRules;
  followUpTriggers?: Record<string, string[]>;
}

export interface OnboardingFormData {
  when: string;
  duration: number;
  location: string[];
  energy: string;
  deadline: Date;
  goals?: string;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  userId?: string;
}

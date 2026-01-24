import { env } from "@/config/env";

export const BASE = `${env.api.BASE_API_URL}`;
export const USER_BASE = `${BASE}/users`;
export const TASK_BASE = `${BASE}/tasks`;

// Change to relative paths
export const USER_ROUTES = {
  SIGNUP: `${USER_BASE}/signup`,
  LOGIN: `${USER_BASE}/login`,
  LOGOUT: `${USER_BASE}/logout`,
  REFRESH_TOKEN: `${USER_BASE}refresh-token`,
  PROFILE: `${USER_BASE}/profile`,
};

export const TASK_ROUTES = {
  CREATE: "/create",
  UPDATE: (taskId: string) => `/${taskId}/update`,
  DELETE: (taskId: string) => `/${taskId}/delete`,
  LIST: "/",
};

export const SUBTASK_ROUTES = {
  CREATE: (taskId: string) => `/${taskId}/subtasks/create`,
  UPDATE: (taskId: string, subtaskId: string) => `/${taskId}/subtasks/${subtaskId}/update`,
  DELETE: (taskId: string, subtaskId: string) => `/${taskId}/subtasks/${subtaskId}/delete`,
};

export const BEHAVIOR_PATTERN_ROUTES = {
  CREATE: (taskId: string) => `/${taskId}/behavior-patterns/create`,
  UPDATE: (taskId: string, behaviorPatternId: string) => `/${taskId}/behavior-patterns/${behaviorPatternId}/update`,
  DELETE: (taskId: string, behaviorPatternId: string) => `/${taskId}/behavior-patterns/${behaviorPatternId}/delete`,
};

export const ONBOARDING_ROUTES = {
  NEXT: "/next",
  SAVE_PERSONA: "/save-persona",
};

export const WEBHOOK_ROUTES = {
  CLERK_WEBHOOK: "/webhooks/clerk-webhook",
};



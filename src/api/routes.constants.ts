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

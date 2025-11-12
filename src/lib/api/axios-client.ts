import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { handleApiError, ErrorType } from "@/lib/api/error-handler";
import { env } from "@/config/env";
import { auth } from "@clerk/nextjs/server";

const api = axios.create({
  baseURL: env.api.BASE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Server-side auth header helper
async function getServerAuthHeaders() {
  const { getToken } = await auth();
  const token = await getToken({ template: "default" });
  if (!token) throw new Error("User not authenticated");
  return { Authorization: `Bearer ${token}` };
}

// --- Error Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const handled = handleApiError(error, {
      context: "API",
      showToast: true,
    });

    if (
      handled.apiError.type === ErrorType.AUTH &&
      handled.apiError.statusCode === 401
    ) {
      console.warn("Unauthorized: clearing Clerk session soon...");
    }

    return Promise.reject(handled.apiError);
  }
);

// --- Generic API Request ---
export async function request<T = unknown>(
  method: Method,
  url: string,
  options: {
    data?: unknown;
    config?: AxiosRequestConfig;
    isAuthenticated?: boolean;
  } = {}
): Promise<AxiosResponse<T>> {
  const { data, config = {}, isAuthenticated = false } = options;

  let headers = config.headers;
  if (isAuthenticated) {
    const authHeaders = await getServerAuthHeaders();
    headers = { ...headers, ...authHeaders };
  }

  return api.request<T>({
    method,
    url,
    data,
    ...config,
    headers,
  });
}

export default api;

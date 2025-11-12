export enum ErrorType {
  NETWORK = "network",
  AUTH = "auth",
  VALIDATION = "validation",
  NOT_FOUND = "not_found",
  SERVER = "server",
  UNKNOWN = "unknown",
}

export interface ApiError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError: unknown;
}

export interface ToastInfo {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface HandleApiErrorOptions {
  context?: string;
  showToast?: boolean;
  customMessage?: string;
  toastType?: "success" | "error" | "warning" | "info";
}

export function handleApiError(
  error: unknown,
  options?: HandleApiErrorOptions
): { apiError: ApiError; toastInfo: ToastInfo } {
  const isDev = process.env.NODE_ENV === "development";
  const apiError = classifyError(error);

  const {
    context,
    showToast: optionShowToast,
    customMessage,
    toastType,
  } = options || {};

  const showToast =
    optionShowToast === false
      ? false
      : !isDev
      ? true
      : optionShowToast ?? false;

  if (isDev && context) {
    console.error(`❌ [${context}]`, {
      type: apiError.type,
      message: apiError.message,
      statusCode: apiError.statusCode,
      error: apiError.originalError,
    });
  }

  const finalToastType =
    toastType || (apiError.type === ErrorType.AUTH ? "warning" : "error");

  return {
    apiError,
    toastInfo: {
      show: showToast,
      message: getFriendlyErrorMessage(apiError, customMessage),
      type: finalToastType,
    },
  };
}

function classifyError(error: unknown): ApiError {
  if (error && typeof error === "object" && "response" in error) {
    const status = (error as any).response?.status;

    if (status === 401 || status === 403) {
      return {
        type: ErrorType.AUTH,
        message: "Authentication failed",
        statusCode: status,
        originalError: error,
      };
    }
    if (status === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: "Resource not found",
        statusCode: status,
        originalError: error,
      };
    }
    if (status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: "Server error occurred",
        statusCode: status,
        originalError: error,
      };
    }
  }

  if (error instanceof Error) {
    if (
      error.message.toLowerCase().includes("network") ||
      error.name === "NetworkError"
    ) {
      return {
        type: ErrorType.NETWORK,
        message: error.message,
        originalError: error,
      };
    }
  }

  return {
    type: ErrorType.UNKNOWN,
    message: error instanceof Error ? error.message : "Unknown error",
    originalError: error,
  };
}

export function getFriendlyErrorMessage(
  apiError: ApiError,
  customMessage?: string
): string {
  if (customMessage) return customMessage;

  switch (apiError.type) {
    case ErrorType.NETWORK:
      return "Network connection lost. Please check your internet.";
    case ErrorType.AUTH:
      return "Session expired. Please log in again.";
    case ErrorType.NOT_FOUND:
      return "The requested item could not be found.";
    case ErrorType.SERVER:
      return "Our servers are having issues. Please try again later.";
    case ErrorType.VALIDATION:
      return apiError.message;
    default:
      return "Something went wrong. Please try again.";
  }
}

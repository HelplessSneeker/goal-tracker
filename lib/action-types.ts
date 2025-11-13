/**
 * Shared types for server actions
 * Provides type-safe response structures with proper error handling
 */

/**
 * Error codes for different types of failures
 */
export enum ActionErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DATABASE_ERROR = "DATABASE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Field-level validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Error response structure
 */
export interface ActionError {
  error: string;
  code: ActionErrorCode;
  validationErrors?: ValidationError[];
  success?: boolean;
}

/**
 * Success response structure (generic)
 */
export interface ActionSuccess<T> {
  success: true;
  data: T;
}

/**
 * Action response type (union of success and error)
 */
export type ActionResponse<T> = ActionSuccess<T> | ActionError;

/**
 * Type guard to check if response is an error
 * Can be used with ActionResponse or validation results
 */
export function isActionError(response: unknown): response is ActionError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    "code" in response
  );
}

/**
 * Type guard to check if response is successful
 */
export function isActionSuccess<T>(
  response: ActionResponse<T>,
): response is ActionSuccess<T> {
  return "success" in response && response.success === true;
}

/**
 * Helper to create error responses
 */
export function createError(
  message: string,
  code: ActionErrorCode,
  validationErrors?: ValidationError[],
): ActionError {
  return {
    error: message,
    code,
    ...(validationErrors ? { validationErrors } : {}),
  };
}

/**
 * Helper to create success responses
 */
export function createSuccess<T>(data: T): ActionSuccess<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Validation and sanitization utilities for server actions
 * Uses Zod for schema validation and custom sanitization for security
 */

import { z } from "zod";
import {
  ActionErrorCode,
  ValidationError,
  createError,
  type ActionError,
} from "./action-types";

/**
 * Sanitize string input to prevent XSS attacks
 * Removes HTML tags, control characters, and dangerous patterns
 * Note: React automatically escapes output, so this provides defense in depth
 */
export function sanitizeString(value: string): string {
  return (
    value
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove null bytes and control characters (except newlines, tabs, carriage returns)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Remove script-like patterns
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      // Trim whitespace
      .trim()
  );
}

/**
 * Sanitize optional string (can be null or undefined)
 */
export function sanitizeOptionalString(
  value: string | null | undefined
): string | undefined {
  if (!value) return undefined;
  const sanitized = sanitizeString(value);
  return sanitized === "" ? undefined : sanitized;
}

// =============================================================================
// Zod Schemas
// =============================================================================

/**
 * Goal validation schemas
 */
export const goalSchemas = {
  create: z.object({
    title: z
      .string()
      .nullable()
      .transform((val) => val || "")
      .pipe(z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"))
      .transform(sanitizeString),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => sanitizeOptionalString(val ?? undefined)),
  }),
  update: z.object({
    id: z.string().uuid("Invalid goal ID"),
    title: z
      .string()
      .nullable()
      .transform((val) => val || "")
      .pipe(z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"))
      .transform(sanitizeString),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => sanitizeOptionalString(val ?? undefined)),
  }),
  delete: z.object({
    id: z.string().uuid("Invalid goal ID"),
  }),
};

/**
 * Region validation schemas
 */
export const regionSchemas = {
  create: z.object({
    goalId: z.string().uuid("Invalid goal ID"),
    title: z
      .string()
      .nullable()
      .transform((val) => val || "")
      .pipe(z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"))
      .transform(sanitizeString),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => sanitizeOptionalString(val ?? undefined)),
  }),
  update: z.object({
    id: z.string().uuid("Invalid region ID"),
    title: z
      .string()
      .nullable()
      .transform((val) => val || "")
      .pipe(z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"))
      .transform(sanitizeString),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => sanitizeOptionalString(val ?? undefined)),
  }),
  delete: z.object({
    id: z.string().uuid("Invalid region ID"),
  }),
};

/**
 * Task validation schemas
 */
export const taskSchemas = {
  create: z.object({
    regionId: z.string().uuid("Invalid region ID"),
    title: z
      .string()
      .nullable()
      .transform((val) => val || "")
      .pipe(z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"))
      .transform(sanitizeString),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => sanitizeOptionalString(val ?? undefined)),
    deadline: z.coerce.date({ message: "Invalid deadline date" }),
    status: z
      .enum(["active", "incomplete", "completed"], {
        message: "Status must be active, incomplete, or completed",
      })
      .default("active"),
  }),
  update: z.object({
    id: z.string().uuid("Invalid task ID"),
    title: z
      .string()
      .nullable()
      .transform((val) => val || "")
      .pipe(z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"))
      .transform(sanitizeString),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => sanitizeOptionalString(val ?? undefined)),
    deadline: z.coerce.date({ message: "Invalid deadline date" }),
    status: z.enum(["active", "incomplete", "completed"], {
      message: "Status must be active, incomplete, or completed",
    }),
  }),
  delete: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
};

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate FormData against a Zod schema
 * Returns validated data or an ActionError with field-specific validation errors
 */
export function validateFormData<T extends z.ZodType>(
  schema: T,
  data: Record<string, unknown>
): z.infer<T> | ActionError {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return createError(
        "Validation failed. Please check your input.",
        ActionErrorCode.VALIDATION_ERROR,
        validationErrors
      );
    }

    return createError(
      "Invalid input data",
      ActionErrorCode.VALIDATION_ERROR
    );
  }
}

/**
 * Extract and prepare data from FormData object
 * Handles null values and type conversion
 */
export function extractFormData(
  formData: FormData
): Record<string, string | null> {
  const data: Record<string, string | null> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      // Store empty strings as null for optional fields
      data[key] = value.trim() === "" ? null : value.trim();
    }
  }

  return data;
}

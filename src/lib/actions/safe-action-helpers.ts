import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { SafeActionResult } from "./safe-action-types";

export const DEFAULT_VALIDATION_ERROR_MESSAGE =
  "An error occurred validating your input. Check the fields.";
export const DATABASE_ERROR_MESSAGE = "An error occurred with our database.";
const DEFAULT_BIND_ARGS_ERROR_MESSAGE =
  "Error processing server action arguments.";
const DEFAULT_UNKNOWN_ERROR_MESSAGE = "An unexpected error occurred.";

type SafeActionResponse<TData> =
  | {
      success: true;
      data: NonNullable<TData>;
      error?: undefined;
    }
  | {
      success: false;
      data?: undefined;
      error: string;
    };

export function getSafeActionResponse<TData = unknown>(
  result: SafeActionResult<TData> | null | undefined
): SafeActionResponse<TData> {
  if (!result) {
    console.warn("getSafeActionResponse received null or undefined result.");
    return { success: false, error: DEFAULT_SERVER_ERROR_MESSAGE };
  }

  if (result.serverError) return { success: false, error: result.serverError };

  if (
    result.validationErrors &&
    Object.keys(result.validationErrors).length > 0
  ) {
    return { success: false, error: DEFAULT_VALIDATION_ERROR_MESSAGE };
  }

  if (
    result.bindArgsValidationErrors &&
    Object.keys(result.bindArgsValidationErrors).length > 0
  ) {
    return { success: false, error: DEFAULT_BIND_ARGS_ERROR_MESSAGE };
  }

  if (result.fetchError) {
    return { success: false, error: result.fetchError };
  }

  if (!result.data || result.serverError) {
    return {
      success: false,
      error: DEFAULT_UNKNOWN_ERROR_MESSAGE,
    };
  }

  return { success: true, data: result.data };
}

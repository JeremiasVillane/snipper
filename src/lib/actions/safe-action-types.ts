/**
 * Represents the potential response structure of a next-safe-action.
 * @template TData The type of data returned in case of success.
 */
export type SafeActionResult<TData = unknown> = {
  data?: TData | null; // Data in case of success.
  serverError?: string | null; // Server error or returned explicitly
  validationErrors?: object | null; // Zod schema validation errors
  bindArgsValidationErrors?: object | null; // Bind argument validation errors
  fetchError?: string | null; // Errors related to fetch (less common in pure server actions)
};

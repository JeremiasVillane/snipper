export async function validateCustomAlias(alias: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  if (alias.length < 3) {
    return {
      valid: false,
      error: "Custom alias must be at least 3 characters",
    };
  }

  if (alias.length > 15) {
    return { valid: false, error: "Custom alias cannot exceed 15 characters" };
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(alias)) {
    return {
      valid: false,
      error:
        "Custom alias can only contain letters, numbers, hyphens and underscores",
    };
  }

  return { valid: true };
}

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { processShortLink, verifyPassword } from "@/lib/actions/short-links";

import { getSafeActionResponse } from "../safe-action-helpers";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
  shortCode: z.string(),
});

export interface VerifyPasswordState {
  message: string | null;
  success: boolean;
}

export async function verifyPasswordAndProcessShortLink(
  shortCode: string,
  resolvedSearchParams: {
    [key: string]: string | string[] | undefined;
  },
  _previousState: VerifyPasswordState,
  formData: FormData,
): Promise<VerifyPasswordState> {
  const result = passwordSchema.safeParse({
    password: formData.get("password"),
    shortCode: shortCode,
  });

  if (!result.success) {
    return { success: false, message: "Invalid input." };
  }

  const { password } = result.data;
  let verificationUrl: string | undefined;

  try {
    const verificationResult = await verifyPassword({
      shortCode,
      plainPassword: password,
    }).then((res) => getSafeActionResponse(res));

    if (!verificationResult || !verificationResult.success) {
      return { success: false, message: "Invalid password." };
    }

    if (!verificationResult.data.url) {
      console.error(
        "Verification successful but no URL returned for shortCode:",
        shortCode,
      );
      return {
        success: false,
        message: "Internal server error: Missing target URL.",
      };
    }

    verificationUrl = verificationResult.data.url;

    await processShortLink({ shortCode, resolvedSearchParams });
  } catch (error) {
    console.error("Password verification or click recording failed:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed during verification/recording";
    return {
      success: false,
      message:
        errorMessage === "Invalid password"
          ? errorMessage
          : "An unexpected error occurred.",
    };
  }

  if (!verificationUrl) {
    console.error(
      "Reached redirect point but verificationUrl is missing for shortCode:",
      shortCode,
    );
    return {
      success: false,
      message: "Internal server error: Could not determine redirect URL.",
    };
  }

  redirect(verificationUrl);
}

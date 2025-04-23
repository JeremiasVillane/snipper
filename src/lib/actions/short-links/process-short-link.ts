"use server";

import { recordClick, verifyPassword } from "@/lib/actions/short-links";
import { parseUserAgentImproved } from "@/lib/helpers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
  shortCode: z.string(),
});

export interface VerifyPasswordState {
  message: string | null;
  success: boolean;
}

export async function verifyPasswordAndRecordClick(
  shortCode: string,
  _previousState: VerifyPasswordState,
  formData: FormData
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
    const verificationResult = await verifyPassword(shortCode, password);

    if (!verificationResult || !verificationResult.success) {
      return { success: false, message: "Invalid password." };
    }

    if (!verificationResult.url) {
      console.error(
        "Verification successful but no URL returned for shortCode:",
        shortCode
      );
      return {
        success: false,
        message: "Internal server error: Missing target URL.",
      };
    }

    verificationUrl = verificationResult.url;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const referrer = headersList.get("referer") || "";
    const xForwardedFor = headersList.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";
    const rawCountry = headersList.get("x-vercel-ip-country");
    const rawCity = headersList.get("x-vercel-ip-city");

    let country = "Unknown",
      city = "Unknown";

    if (rawCountry) {
      try {
        country = decodeURIComponent(rawCountry);
      } catch (e) {
        country = rawCountry;
      }
    } else {
      try {
        const realIP = await fetch("https://api.ipify.org/?format=json")
          .then((res) => res.json())
          .then((res) => res?.ip);
        const res = await fetch(`http://ip-api.com/json/${realIP}`)
          .then((res) => res.json())
          .then((res) => res);
        country = res?.countryCode;
      } catch (e) {
        country = country;
      }
    }
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity);
      } catch (e) {
        city = rawCity;
      }
    } else {
      try {
        const realIP = await fetch("https://api.ipify.org/?format=json")
          .then((res) => res.json())
          .then((res) => res?.ip);
        const res = await fetch(`http://ip-api.com/json/${realIP}`)
          .then((res) => res.json())
          .then((res) => res);
        city = decodeURIComponent(res?.city);
      } catch (e) {
        city = city;
      }
    }

    const { browser, os, device } = parseUserAgentImproved(userAgent);

    recordClick(shortCode, {
      ipAddress: ip,
      userAgent,
      referrer,
      device,
      browser,
      os,
      country,
      city,
    }).catch(console.error);
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
      shortCode
    );
    return {
      success: false,
      message: "Internal server error: Could not determine redirect URL.",
    };
  }

  redirect(verificationUrl);
}

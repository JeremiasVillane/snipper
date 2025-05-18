import { NextResponse } from "next/server";
import { env } from "@/env.mjs";

import { signUp } from "@/lib/auth";
import { checkIpReputation, validateEmail } from "@/lib/security";

export async function POST(req: Request) {
  const { email, name, password, turnstileToken } = await req.json();

  let ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!ip) {
    ip = await fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((res) => res?.ip);
  }

  if (ip) {
    const isBadIp = await checkIpReputation(ip);
    if (isBadIp) {
      console.warn(`Blocked IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: "BLOCKED_IP" },
        { status: 403 },
      );
    }
  }

  if (!turnstileToken) {
    console.error("Registration CAPTCHA: Turnstile token missing.");
    return NextResponse.json(
      { success: false, error: "CAPTCHA_FAILED" },
      { status: 400 },
    );
  }

  const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  try {
    const turnstileResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const outcome: { success: boolean; "error-codes"?: string[] } =
      await turnstileResponse.json();

    if (!outcome.success) {
      console.error(
        "Registration CAPTCHA: Turnstile verification failed:",
        outcome["error-codes"],
      );
      return NextResponse.json(
        { success: false, error: "CAPTCHA_FAILED" },
        { status: 400 },
      );
    }

    console.info("Registration CAPTCHA: Turnstile verification successful.");
  } catch (error) {
    console.error(
      "Registration CAPTCHA: Error during Turnstile verification fetch:",
      error,
    );
    return NextResponse.json(
      { success: false, error: "Error verifying CAPTCHA." },
      { status: 500 },
    );
  }

  try {
    const isValidEmail = await validateEmail(email);

    if (!!isValidEmail?.autocorrect && isValidEmail?.autocorrect.length > 0) {
      return NextResponse.json(
        { error: "Email autocorrected", autocorrect: isValidEmail.autocorrect },
        { status: 400 },
      );
    }

    if (isValidEmail.risk !== "low") {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    await signUp(email, name, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during user signup process:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create account",
      },
      { status: 500 },
    );
  }
}

import { error } from "console";
import { NextResponse } from "next/server";

import { signUp } from "@/lib/auth";
import { validateEmail } from "@/lib/security";

export async function POST(request: Request) {
  const { email, name, password } = await request.json();

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}

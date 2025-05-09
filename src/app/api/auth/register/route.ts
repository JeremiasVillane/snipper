import { NextResponse } from "next/server";

import { signUp } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, name, password } = await request.json();
  try {
    await signUp(email, name, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}

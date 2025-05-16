import { NextRequest } from "next/server";
import { publicUrl } from "@/env.mjs";

export function getRootUrl(request: NextRequest): string {
  const publicUrlObj = new URL(publicUrl);
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  return `${protocol}://${publicUrlObj.hostname}`;
}

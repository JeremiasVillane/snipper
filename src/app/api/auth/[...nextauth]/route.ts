import { authOptions } from "@/libs/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

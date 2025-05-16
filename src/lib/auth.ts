// import GitHubProvider from "next-auth/providers/github";
import { env } from "@/env.mjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/db/prisma";
import { usersRepository } from "@/lib/db/repositories";

import { checkIpReputation } from "./security";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      emailVerified?: Date;
      name?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified?: Date;
  }
}

interface CredentialsWithTurnstile extends Record<string, string | undefined> {
  email?: string;
  password?: string;
  turnstileToken?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // GitHubProvider({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let ip = req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim();

        if (!ip) {
          ip = await fetch("https://api.ipify.org/?format=json")
            .then((res) => res.json())
            .then((res) => res?.ip);
        }

        const isBadIp = await checkIpReputation(ip);
        if (isBadIp) {
          console.warn(`Blocked IP: ${ip}`);
          throw new Error("Access denied");
        }

        const creds = credentials as CredentialsWithTurnstile;

        if (!creds?.email || !creds?.password) {
          return null;
        }

        const turnstileToken = creds.turnstileToken;

        if (!turnstileToken) {
          console.error("Turnstile token missing from credentials.");
          return null;
        }

        const verifyUrl =
          "https://challenges.cloudflare.com/turnstile/v0/siteverify";

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
              "Turnstile verification failed:",
              outcome["error-codes"],
            );
            return null; // CAPTCHA failed
          }

          console.log("Turnstile verification successful.");
        } catch (error) {
          console.error("Error during Turnstile verification fetch:", error);
          return null;
        }

        try {
          const user = await usersRepository.findByEmail(creds.email);
          if (!user || !user.password) {
            console.warn("User not found or no password set.");
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            creds.password,
            user.password,
          );

          if (!passwordMatch) {
            console.warn("Password mismatch for user:", user.email);
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error(
            "Error in authorize during user lookup/password check:",
            error,
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export async function auth() {
  return getServerSession(authOptions);
}

export async function signUp(
  email: string,
  name: string,
  passwordPlain: string,
) {
  try {
    const existingUser = await usersRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const password = await bcrypt.hash(passwordPlain, 12);

    await usersRepository.create({
      name,
      email,
      password,
      emailVerified: null,
      image: null,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error during signup:", error);
    throw new Error(error.message || "Failed to create account");
  }
}

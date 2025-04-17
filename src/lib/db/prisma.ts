import { PrismaClient as Client } from "@prisma/client";

declare global {
  var prisma: Client | undefined;
}

export type PrismaClient = Client;
export const prisma = global.prisma || new Client();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

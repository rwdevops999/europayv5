import { PrismaClient } from "@/generated/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

let prisma = globalThis.prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

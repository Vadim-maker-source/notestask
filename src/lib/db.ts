import { PrismaClient } from "@prisma/client";

// Переиспользуем единственный экземпляр PrismaClient во время hot-reload
// в разработке, чтобы не исчерпать пул соединений с БД.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

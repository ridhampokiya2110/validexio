import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Mock Prisma Client for UI Development when DB is not connected
const createMockPrisma = () => {
  const mockHandler = {
    get(target: any, prop: string) {
      if (prop === '$connect' || prop === '$disconnect') return async () => {};
      return new Proxy({}, {
        get(t: any, method: string) {
          return async () => {
            if (method.startsWith('findMany')) return [];
            if (method.startsWith('findUnique') || method.startsWith('findFirst')) {
              // Return a mock object so user lookups don't fail in API routes
              return { 
                id: "mock-id", 
                email: "designer@validexio.com", 
                subscription: { id: "mock-sub" },
                orders: []
              };
            }
            if (method === 'count') return 0;
            return { id: "mock-id" };
          };
        }
      });
    }
  };
  return new Proxy({}, mockHandler) as unknown as PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL
    ? new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      })
    : createMockPrisma());

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

export default prisma;


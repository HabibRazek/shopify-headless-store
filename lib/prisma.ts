import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

let prismaInstance: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : [],
  });
}

// Export a function that creates the client only when needed
export function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('Database not available - DATABASE_URL is not set');
  }

  try {
    if (process.env.NODE_ENV === 'production') {
      if (!prismaInstance) {
        prismaInstance = createPrismaClient();
      }
      if (!prismaInstance) {
        throw new Error('Failed to create Prisma client instance');
      }
      return prismaInstance;
    } else {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
      }
      if (!globalForPrisma.prisma) {
        throw new Error('Failed to create global Prisma client instance');
      }
      return globalForPrisma.prisma;
    }
  } catch (error) {
    console.error('Error creating Prisma client:', error);
    throw new Error(`Prisma client creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// For backward compatibility, export a default instance
// But only create it if we're not in build mode
const prisma = (() => {
  try {
    // Don't create during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      return {} as PrismaClient;
    }
    return getPrismaClient();
  } catch {
    return {} as PrismaClient;
  }
})();

export { prisma };
export default prisma;

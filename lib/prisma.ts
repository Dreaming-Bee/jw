// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({ log: ['query'] })
  }
  // @ts-ignore
  prisma = global.prisma
}

export { prisma }
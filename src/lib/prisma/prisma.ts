import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"

const prismaClientSingleton = () => {
  // 1. Criamos um pool de conexão usando o driver 'pg' padrão do Node
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Criamos o adaptador do Prisma para esse driver
  const adapter = new PrismaPg(pool)
  
  // 3. Passamos o adapter para o client
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
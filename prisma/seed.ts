import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from "../src/lib/prisma/prisma"

async function main() {

  // Verificar se banco possui dados
  const userCount = await prisma.user.count();
  
  if (userCount > 0) {
    console.log("✅ Banco já possui dados. Pulando seed...");
    return;
  }

  // 1. Criar Usuário Admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)

  console.log('Criando/Atualizando usuario admin...');
  
  await prisma.user.upsert({
    where: { email: 'admin@nova-boavista.com' },
    update: {},
    create: {
      email: 'admin@nova-boavista.com',
      name: 'Administrador Nova Boavista',
      password: hashedAdminPassword,
      role: Role.ADMIN,
    },
  })

  console.log("🌱 Banco vazio detectado. Populando dados...");

  // 2. Criar Bancos com dados reais
  const banks = [
    { name: 'Caixa Econômica Federal', code: '104', cnpj: '00360305000104' },
    { name: 'Bradesco', code: '237', cnpj: '60746948000112' },
    { name: 'Banco Daycoval', code: '707', cnpj: '62232889000190' },
    { name: 'Nubank', code: '260', cnpj: '18236120000158' },
    { name: 'Santander', code: '033', cnpj: '90400888000142' },
  ]

  for (const bank of banks) {
    await prisma.bank.upsert({
      where: { code: bank.code },
      update: { name: bank.name, cnpj: bank.cnpj },
      create: bank,
    })
  }

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
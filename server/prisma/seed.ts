import 'dotenv/config';
import { PrismaClient, TransactionType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// In Prisma 7, datasourceUrl is a valid option but might need 'any' for TS in some versions
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
} as any);

async function main() {
  console.log("Starting seed...");
  // 1. Create Admin User
  const adminEmail = 'admin@truechurch.com.br';
  const hashedPassword = await bcrypt.hash('True@Church2026', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador True Church',
      role: UserRole.ADMIN,
    },
  });

  console.log(`Initial admin created: ${admin.email}`);

  // 2. Create Modular Categories
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    const defaultCategories = [
      { name: 'Dízimo', type: TransactionType.RECEITA },
      { name: 'Oferta', type: TransactionType.RECEITA },
      { name: 'Doação', type: TransactionType.RECEITA },
      { name: 'Venda de Materiais', type: TransactionType.RECEITA },
      { name: 'Missões', type: TransactionType.RECEITA },
      { name: 'Aluguel', type: TransactionType.DESPESA },
      { name: 'Água/Luz/Internet', type: TransactionType.DESPESA },
      { name: 'Ministérios', type: TransactionType.DESPESA },
      { name: 'Manutenção', type: TransactionType.DESPESA },
      { name: 'Salários', type: TransactionType.DESPESA },
      { name: 'Outros', type: TransactionType.DESPESA },
    ];

    await prisma.category.createMany({
      data: defaultCategories as any,
    });
    console.log('Default categories created.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

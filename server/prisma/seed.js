require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando Seed (JS com Adapter)...");
  
  const adminEmail = 'admin@truechurch.com.br';
  const hashedPassword = await bcrypt.hash('True@Church2026', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador True Church',
      role: 'ADMIN',
    },
  });

  console.log(`Admin criado: ${admin.email}`);

  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    const defaultCategories = [
      { name: 'Dízimo', type: 'RECEITA' },
      { name: 'Oferta', type: 'RECEITA' },
      { name: 'Doação', type: 'RECEITA' },
      { name: 'Venda de Materiais', type: 'RECEITA' },
      { name: 'Missões', type: 'RECEITA' },
      { name: 'Aluguel', type: 'DESPESA' },
      { name: 'Água/Luz/Internet', type: 'DESPESA' },
      { name: 'Ministérios', type: 'DESPESA' },
      { name: 'Manutenção', type: 'DESPESA' },
      { name: 'Salários', type: 'DESPESA' },
      { name: 'Outros', type: 'DESPESA' },
    ];

    await prisma.category.createMany({
      data: defaultCategories,
    });
    console.log('Categorias criadas.');
  }
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

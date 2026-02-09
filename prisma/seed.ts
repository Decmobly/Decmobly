import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient(); // Funciona nativamente na v5

async function main() {
  console.log('🚀 Iniciando seed (Prisma v5)...');

  const categories = [
    { name: 'Cozinha', slug: 'cozinha' },
    { name: 'Quarto', slug: 'quarto' },
    { name: 'Sala', slug: 'sala' },
    { name: 'Banheiro', slug: 'banheiro' },
    { name: 'Casa', slug: 'casa' },
    { name: 'Escritório', slug: 'escritorio' },
    { name: 'Outros', slug: 'outros' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const hashedPassword = await bcrypt.hash('Decmobly$#', 10);

  await prisma.user.upsert({
    where: { email: 'gustavolevenhagen@gmail.com' },
    update: {},
    create: {
      name: 'Gustavo Levenhagen',
      email: 'gustavolevenhagen@gmail.com',
      password: hashedPassword,
      role: Role.DEVELOPER,
      phone: '92984228634',
    },
  });

  console.log('✅ Seed finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
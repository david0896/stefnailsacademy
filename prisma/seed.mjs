import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@stefnailsacademy.com';

  const existing = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('✓ Admin ya existe — seed omitido.');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin1234!', 10);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Administrador',
    },
  });

  console.log(`✓ Admin creado: ${admin.email}`);
  console.log('  Email:      admin@stefnailsacademy.com');
  console.log('  Contraseña: Admin1234!');
  console.log('  ⚠ Cambia la contraseña después del primer login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

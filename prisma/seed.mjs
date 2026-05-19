import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Tasas de cambio fallback (admin actualiza desde /backoffice/contenido) ─
const tasasFallback = [
  { key: 'tasa.eur.bcv', type: 'TEXT', value: '60' },
  { key: 'tasa.usd.bcv', type: 'TEXT', value: '55' },
];

// ─── Slides del Hero carousel ─────────────────────────────────────────────
const heroSlides = [
  {
    key: 'hero.slide.1',
    type: 'JSON',
    value: JSON.stringify({
      titulo: 'Academia especializada en uñas profesionales',
      subtitulo: 'Domina las técnicas de uñas más innovadoras',
      descripcion: 'Cursos prácticos presenciales y online, personalizados y grupales para que te conviertas en un experto/a en diseño y elaboración de uñas.',
      imagenUrl: 'https://i.postimg.cc/fT1P7Mzt/background-u-as-profesionales.png',
      imagenBajaCal: 'https://i.postimg.cc/XJtR5T4K/first-banner-blur.jpg',
      ctaTexto: 'Reserva tu lugar en la próxima clase',
      ctaUrl: '/Courses',
      tipo: 'hero_principal',
      activo: true,
    }),
  },
  {
    key: 'hero.slide.2',
    type: 'JSON',
    value: JSON.stringify({
      titulo: 'Aprende desde donde estés',
      subtitulo: 'Cursos online disponibles',
      descripcion: 'Accede a nuestra formación profesional en uñas desde cualquier lugar del mundo. Aprende a tu ritmo con instructores activos en la industria.',
      imagenUrl: 'https://i.postimg.cc/fT1P7Mzt/background-u-as-profesionales.png',
      imagenBajaCal: 'https://i.postimg.cc/XJtR5T4K/first-banner-blur.jpg',
      ctaTexto: 'Ver cursos online',
      ctaUrl: '/Courses',
      tipo: 'hero_secundario',
      activo: true,
    }),
  },
  {
    key: 'hero.slide.3',
    type: 'JSON',
    value: JSON.stringify({
      titulo: 'Próximamente nuestra tienda online',
      subtitulo: 'Productos profesionales para nail artists',
      descripcion: 'Encuentra artículos de alta calidad de las marcas más reconocidas del sector, diseñados para potenciar tu talento desde un solo lugar.',
      imagenUrl: 'https://i.postimg.cc/fT1P7Mzt/background-u-as-profesionales.png',
      imagenBajaCal: 'https://i.postimg.cc/XJtR5T4K/first-banner-blur.jpg',
      ctaTexto: 'Únete a nuestra comunidad',
      ctaUrl: 'https://wa.link/pxwwz5',
      tipo: 'hero_tienda',
      activo: true,
    }),
  },
];

async function main() {
  // ─── Admin user ───────────────────────────────────────────────────────────
  const email = 'admin@stefnailsacademy.com';
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    console.log('✓ Admin ya existe — seed omitido.');
  } else {
    const hashedPassword = await bcrypt.hash('Admin1234!', 10);
    const admin = await prisma.adminUser.create({
      data: { email, password: hashedPassword, name: 'Administrador' },
    });
    console.log(`✓ Admin creado: ${admin.email}`);
    console.log('  Email:      admin@stefnailsacademy.com');
    console.log('  Contraseña: Admin1234!');
    console.log('  ⚠ Cambia la contraseña después del primer login.');
  }

  // ─── Tasas de cambio fallback ─────────────────────────────────────────────
  for (const tasa of tasasFallback) {
    await prisma.content.upsert({
      where: { key: tasa.key },
      update: {},                         // no sobreescribir si el admin ya la actualizó
      create: { key: tasa.key, value: tasa.value, type: tasa.type },
    });
    console.log(`✓ Tasa fallback seeded: ${tasa.key}`);
  }

  // ─── Hero slides (upsert — no rompe si ya existen) ───────────────────────
  for (const slide of heroSlides) {
    await prisma.content.upsert({
      where: { key: slide.key },
      update: { value: slide.value, type: slide.type },
      create: { key: slide.key, value: slide.value, type: slide.type },
    });
    console.log(`✓ Slide seeded: ${slide.key}`);
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

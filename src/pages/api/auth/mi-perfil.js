import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

const nullishToUndef = (v) => (v === null || v === '' || v === undefined ? undefined : v);

const updateMyProfileSchema = z.object({
  firstName:       z.string().min(2, 'Mínimo 2 caracteres').optional(),
  lastName:        z.string().min(2, 'Mínimo 2 caracteres').optional(),
  phone:           z.preprocess(nullishToUndef, z.string().min(7, 'Teléfono inválido').optional()),
  idNumber:        z.preprocess(nullishToUndef, z.string().min(4, 'Cédula inválida').optional()),
  city:            z.preprocess(nullishToUndef, z.string().min(2, 'Ciudad inválida').optional()),
  state:           z.preprocess(nullishToUndef, z.string().min(2, 'Estado inválido').optional()),
  country:         z.preprocess(nullishToUndef, z.string().optional()),
  experienceLevel: z.preprocess(nullishToUndef, z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional()),
  // Cambio de contraseña: opcional. Si viene, debe ser >= 8 chars.
  currentPassword: z.preprocess(nullishToUndef, z.string().optional()),
  newPassword:     z.preprocess(nullishToUndef, z.string().min(8, 'Mínimo 8 caracteres').optional()),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== 'STUDENT') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const studentId = session.user.id;

  if (req.method === 'GET') {
    try {
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (!student) return res.status(404).json({ error: 'Alumno no encontrado' });
      delete student.password; // NUNCA devolver el hash
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const parsed = updateMyProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { currentPassword, newPassword, ...profile } = parsed.data;

    try {
      // Si quiere cambiar contraseña, validamos la actual primero
      if (newPassword) {
        const current = await prisma.student.findUnique({ where: { id: studentId } });
        if (!current) return res.status(404).json({ error: 'Alumno no encontrado' });

        // Si el alumno YA tenía password, tiene que enviar la actual y debe matchear
        if (current.password) {
          if (!currentPassword) {
            return res.status(400).json({ error: 'Debes ingresar tu contraseña actual' });
          }
          const ok = await bcrypt.compare(currentPassword, current.password);
          if (!ok) {
            return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
          }
        }
        // (si no tenía password antes, simplemente la registramos sin validar nada)
        profile.password = await bcrypt.hash(newPassword, 10);
      }

      const updated = await prisma.student.update({
        where: { id: studentId },
        data:  profile,
      });
      delete updated.password;
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

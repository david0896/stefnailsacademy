import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { createEnrollment } from '@/application/enrollments/createEnrollment';
import prisma from '@/lib/prisma';

const inscripcionSchema = z.object({
  courseId:        z.string().min(1, 'Curso requerido'),
  bankName:        z.string().min(1, 'Banco requerido'),
  referenceNumber: z.string().min(1, 'Referencia requerida'),
  // Comprobante de pago: obligatorio desde el sitio público.
  // Es el resultado de POST /api/student/upload-comprobante (paths en bucket privado).
  paymentProofVariants: z.object({
    base:   z.string().min(1),
    width:  z.number().int().positive(),
    height: z.number().int().positive(),
    sizes:  z.record(z.string().min(1)),
  }, { required_error: 'Comprobante de pago requerido' }),
  // Datos del perfil que el alumno puede completar al inscribirse
  firstName:       z.string().min(1).optional(),
  lastName:        z.string().min(1).optional(),
  phone:           z.string().min(7).optional(),
  idNumber:        z.string().min(4).optional(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== 'STUDENT') {
    return res.status(401).json({ error: 'Debes iniciar sesión como alumno para inscribirte' });
  }

  const parsed = inscripcionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const {
    courseId,
    bankName,
    referenceNumber,
    paymentProofVariants,
    firstName,
    lastName,
    phone,
    idNumber,
  } = parsed.data;
  const studentId = session.user.id;

  try {
    // Completar datos del perfil del alumno si faltan
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return res.status(404).json({ error: 'Alumno no encontrado' });

    const profileUpdates = {};
    if (firstName && firstName !== student.firstName) profileUpdates.firstName = firstName;
    if (lastName  && lastName  !== student.lastName)  profileUpdates.lastName  = lastName;
    if (phone     && !student.phone)                  profileUpdates.phone     = phone;
    if (idNumber  && !student.idNumber)               profileUpdates.idNumber  = idNumber;

    if (Object.keys(profileUpdates).length > 0) {
      await prisma.student.update({ where: { id: studentId }, data: profileUpdates });
    }

    // Crear la inscripción
    const enrollment = await createEnrollment({
      studentId,
      courseId,
      paymentMethod:   'TRANSFER',
      bankName,
      referenceNumber,
      paymentProofVariants,
    });

    return res.status(201).json({
      id:            enrollment.id,
      status:        enrollment.status,
      paymentStatus: enrollment.paymentStatus,
    });
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
}

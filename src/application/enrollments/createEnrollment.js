import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';
import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';
import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';
import { sendEnrollmentCreated } from '@/infrastructure/services/emailService';
import { getCurrentBcvEurRate } from '@/infrastructure/services/bcvRate';

const enrollmentRepository = new PrismaEnrollmentRepository();
const courseRepository     = new PrismaCourseRepository();
const studentRepository    = new PrismaStudentRepository();

export const createEnrollment = async (data) => {
  // Validar que el alumno existe
  const student = await studentRepository.findById(data.studentId);
  if (!student) throw new Error('Alumno no encontrado');

  // Validar que el curso existe y está activo
  const course = await courseRepository.findById(data.courseId);
  if (!course) throw new Error('Curso no encontrado');
  if (course.status !== 'ACTIVE') throw new Error('El curso no está activo');

  // Evitar inscripción duplicada (PENDING o CONFIRMED)
  const existing = await enrollmentRepository.findByStudent(data.studentId);
  const duplicate = existing.find(
    (e) => e.courseId === data.courseId &&
           (e.status === 'PENDING' || e.status === 'CONFIRMED')
  );
  if (duplicate) throw new Error('El alumno ya tiene una inscripción activa para este curso');

  // Para cursos presenciales verificar cupos disponibles
  if (course.type === 'PRESENCIAL' && course.maxSpots) {
    const confirmed = await courseRepository.countConfirmedEnrollments(course.id);
    if (confirmed >= course.maxSpots) {
      throw new Error('No hay cupos disponibles para este curso');
    }
  }

  // Snapshot de la tasa BCV EUR en el momento del pago. Non-blocking:
  // si dolarvzla no responde, persistimos null y el BO mostrará "—" para
  // los Bs. La inscripción nunca se rompe por un servicio externo.
  const bcvEurRate = await getCurrentBcvEurRate();
  const amountBs   = bcvEurRate
    ? Math.round(course.priceEUR * bcvEurRate * 100) / 100  // 2 decimales
    : null;

  const enrollment = await enrollmentRepository.create({
    studentId:       data.studentId,
    courseId:        data.courseId,
    status:          'PENDING',
    paymentMethod:   data.paymentMethod,
    paymentStatus:   'PENDING',
    amountEUR:       course.priceEUR,
    bcvEurRate,
    amountBs,
    bankName:        data.bankName        || null,
    referenceNumber: data.referenceNumber || null,
    // Comprobante optimizado (4 variantes WebP) — paths del bucket privado.
    // Opcional en el use case: el sitio público lo exige, el BO puede crear sin él.
    paymentProofVariants: data.paymentProofVariants ?? null,
    notes:           data.notes           || null,
  });

  // Notificar al alumno (acuse) + al admin (alerta para verificar el pago).
  // Non-blocking: si Gmail falla, la inscripción ya quedó creada.
  await sendEnrollmentCreated({
    studentEmail:         enrollment.student.email,
    studentName:          enrollment.student.firstName,
    courseName:           enrollment.course.title,
    enrollmentId:         enrollment.id,
    amountEUR:            enrollment.amountEUR,
    amountBs:             enrollment.amountBs,
    bcvEurRate:           enrollment.bcvEurRate,
    bankName:             enrollment.bankName,
    referenceNumber:      enrollment.referenceNumber,
    paymentProofVariants: enrollment.paymentProofVariants,
  });

  return enrollment;
};

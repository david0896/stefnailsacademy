import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';
import { Enrollment } from '@/domain/entities/Enrollment';
import { sendEnrollmentConfirmed } from '@/infrastructure/services/emailService';

const enrollmentRepository = new PrismaEnrollmentRepository();

export const confirmEnrollment = async (id) => {
  const data = await enrollmentRepository.findById(id);

  if (!data) throw new Error('Inscripción no encontrada');

  const enrollment = new Enrollment(data);

  // Regla de negocio: solo PENDING puede confirmarse
  if (!enrollment.canBeConfirmed()) {
    throw new Error(`No se puede confirmar una inscripción en estado ${enrollment.status}`);
  }

  const updated = await enrollmentRepository.updateStatus(id, 'CONFIRMED', {
    paymentStatus: 'PAID',
    confirmedAt: new Date(),
  });

  // Notificar al alumno por email
  await sendEnrollmentConfirmed({
    studentEmail: data.student.email,
    studentName: `${data.student.firstName} ${data.student.lastName}`,
    courseName: data.course.title,
  });

  return updated;
};

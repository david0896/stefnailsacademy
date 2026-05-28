import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';
import { Enrollment } from '@/domain/entities/Enrollment';
import { sendEnrollmentCancelled } from '@/infrastructure/services/emailService';

const enrollmentRepository = new PrismaEnrollmentRepository();

export const cancelEnrollment = async (id) => {
  const data = await enrollmentRepository.findById(id);

  if (!data) throw new Error('Inscripción no encontrada');

  const enrollment = new Enrollment(data);

  // Regla de negocio: solo PENDING puede cancelarse
  if (!enrollment.canBeCancelled()) {
    throw new Error(`No se puede cancelar una inscripción en estado ${enrollment.status}`);
  }

  const updated = await enrollmentRepository.updateStatus(id, 'CANCELLED');

  // Notificar al alumno + copia al admin (no rompe el caso de uso si Gmail falla)
  await sendEnrollmentCancelled({
    studentEmail: data.student.email,
    studentName:  `${data.student.firstName} ${data.student.lastName}`,
    courseName:   data.course.title,
    enrollmentId: id,
  });

  return updated;
};

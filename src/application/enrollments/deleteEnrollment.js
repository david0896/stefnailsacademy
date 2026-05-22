import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';

const enrollmentRepository = new PrismaEnrollmentRepository();

/**
 * Soft delete: mueve la inscripción a la papelera (deletedAt).
 * Independiente del status (CANCELLED sigue siendo un estado visible).
 */
export const deleteEnrollment = async (id) => {
  const existing = await enrollmentRepository.findById(id);
  if (!existing) {
    throw new Error('Inscripción no encontrada');
  }
  return enrollmentRepository.delete(id);
};

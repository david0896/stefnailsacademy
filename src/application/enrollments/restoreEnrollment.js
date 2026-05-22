import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';

const enrollmentRepository = new PrismaEnrollmentRepository();

export const restoreEnrollment = async (id) => {
  const existing = await enrollmentRepository.findById(id);
  if (!existing) {
    throw new Error('Inscripción no encontrada');
  }
  return enrollmentRepository.restore(id);
};

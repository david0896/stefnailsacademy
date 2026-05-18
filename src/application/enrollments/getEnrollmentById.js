import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';

const enrollmentRepository = new PrismaEnrollmentRepository();

export const getEnrollmentById = async (id) => {
  const enrollment = await enrollmentRepository.findById(id);

  if (!enrollment) {
    throw new Error('Inscripción no encontrada');
  }

  return enrollment;
};

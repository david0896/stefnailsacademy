import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';

const enrollmentRepository = new PrismaEnrollmentRepository();

export const getDeletedEnrollments = async () => {
  return enrollmentRepository.findDeleted();
};

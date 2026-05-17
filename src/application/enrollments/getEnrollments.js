import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';

const enrollmentRepository = new PrismaEnrollmentRepository();

export const getEnrollments = async (filters = {}) => {
  return enrollmentRepository.findAll(filters);
};

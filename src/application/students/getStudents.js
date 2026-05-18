import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const getStudents = async () => {
  return studentRepository.findAll();
};

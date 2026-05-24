import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const getDeletedStudents = async () => {
  return studentRepository.findDeleted();
};

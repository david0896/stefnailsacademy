import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const getStudentHistory = async (id) => {
  const student = await studentRepository.findWithEnrollments(id);

  if (!student) {
    throw new Error('Alumno no encontrado');
  }

  return student;
};

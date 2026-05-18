import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const getStudentById = async (id) => {
  const student = await studentRepository.findById(id);

  if (!student) {
    throw new Error('Alumno no encontrado');
  }

  return student;
};

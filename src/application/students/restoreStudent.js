import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const restoreStudent = async (id) => {
  const existing = await studentRepository.findById(id);
  if (!existing) {
    throw new Error('Alumno no encontrado');
  }
  return studentRepository.restore(id);
};

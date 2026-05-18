import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const createStudent = async (data) => {
  // Regla de negocio: email único
  const existing = await studentRepository.findByEmail(data.email);
  if (existing) {
    throw new Error('Ya existe un alumno registrado con ese correo electrónico');
  }

  return studentRepository.create(data);
};

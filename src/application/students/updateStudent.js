import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const updateStudent = async (id, data) => {
  const existing = await studentRepository.findById(id);
  if (!existing) {
    throw new Error('Alumno no encontrado');
  }

  // Si cambia el email, verificar que no esté en uso por otro alumno
  if (data.email && data.email !== existing.email) {
    const emailTaken = await studentRepository.findByEmail(data.email);
    if (emailTaken) {
      throw new Error('Ya existe un alumno registrado con ese correo electrónico');
    }
  }

  return studentRepository.update(id, data);
};

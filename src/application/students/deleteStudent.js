import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

export const deleteStudent = async (id) => {
  const student = await studentRepository.findWithEnrollments(id);
  if (!student) {
    throw new Error('Alumno no encontrado');
  }

  // Regla de negocio: no eliminar si tiene inscripciones activas
  const activeEnrollments = student.enrollments.filter(
    (e) => e.status === 'PENDING' || e.status === 'CONFIRMED'
  );
  if (activeEnrollments.length > 0) {
    throw new Error('No se puede eliminar un alumno con inscripciones activas o pendientes');
  }

  return studentRepository.delete(id);
};

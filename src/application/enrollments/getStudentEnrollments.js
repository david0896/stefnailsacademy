import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';

const repo = new PrismaEnrollmentRepository();

/**
 * Devuelve todas las inscripciones del alumno, ordenadas por fecha de inscripción descendente.
 * Cada inscripción incluye los datos del curso asociado.
 */
export const getStudentEnrollments = async (studentId) => {
  if (!studentId) return [];
  return repo.findByStudent(studentId);
};

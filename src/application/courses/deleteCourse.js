import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const deleteCourse = async (id) => {
  const existing = await courseRepository.findById(id);

  if (!existing) {
    throw new Error('Curso no encontrado');
  }

  // Regla de negocio: no eliminar cursos con inscripciones confirmadas
  const confirmed = await courseRepository.countConfirmedEnrollments(id);
  if (confirmed > 0) {
    throw new Error('No se puede eliminar un curso con inscripciones confirmadas');
  }

  return courseRepository.delete(id);
};

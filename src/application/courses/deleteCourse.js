import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

/**
 * Soft delete: mueve el curso a la papelera (deletedAt).
 * Reversible y sin romper integridad referencial, por eso no bloqueamos
 * por inscripciones (quedan como histórico; el curso se puede restaurar).
 */
export const deleteCourse = async (id) => {
  const existing = await courseRepository.findById(id);
  if (!existing) {
    throw new Error('Curso no encontrado');
  }
  return courseRepository.delete(id);
};

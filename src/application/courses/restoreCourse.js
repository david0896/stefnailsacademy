import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const restoreCourse = async (id) => {
  const existing = await courseRepository.findById(id);
  if (!existing) {
    throw new Error('Curso no encontrado');
  }
  return courseRepository.restore(id);
};

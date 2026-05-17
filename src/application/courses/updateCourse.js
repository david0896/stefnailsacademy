import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const updateCourse = async (id, data) => {
  const existing = await courseRepository.findById(id);

  if (!existing) {
    throw new Error('Curso no encontrado');
  }

  return courseRepository.update(id, data);
};

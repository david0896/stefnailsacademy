import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const getCourseById = async (id) => {
  const course = await courseRepository.findById(id);

  if (!course) {
    throw new Error('Curso no encontrado');
  }

  return course;
};

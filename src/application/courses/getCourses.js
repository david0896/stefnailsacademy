import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const getCourses = async () => {
  return courseRepository.findAll();
};

export const getActiveCourses = async () => {
  return courseRepository.findActive();
};

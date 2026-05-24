import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const getDeletedCourses = async () => {
  return courseRepository.findDeleted();
};

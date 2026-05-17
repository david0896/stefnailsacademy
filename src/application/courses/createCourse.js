import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const createCourse = async (data) => {
  // Regla de negocio: PRESENCIAL requiere fecha y cupos
  if (data.type === 'PRESENCIAL') {
    if (!data.date) throw new Error('Los cursos presenciales requieren una fecha');
    if (!data.maxSpots) throw new Error('Los cursos presenciales requieren un número de cupos');
  }

  // Regla de negocio: ONLINE no tiene fecha ni cupos
  if (data.type === 'ONLINE') {
    data.date = null;
    data.maxSpots = null;
  }

  return courseRepository.create(data);
};

import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';

const courseRepository = new PrismaCourseRepository();

export const createCourse = async (data) => {
  // Regla de negocio: TODOS los cursos (PRESENCIAL y ONLINE) requieren
  // fecha y cupos. La fecha se usa para ordenar y mostrar los próximos
  // cursos en el sitio público.
  if (!data.date) throw new Error('La fecha es requerida');
  if (!data.maxSpots) throw new Error('El número de cupos es requerido');

  return courseRepository.create(data);
};

import { PrismaEnrollmentRepository } from '@/infrastructure/repositories/PrismaEnrollmentRepository';
import { PrismaCourseRepository } from '@/infrastructure/repositories/PrismaCourseRepository';
import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const enrollmentRepository = new PrismaEnrollmentRepository();
const courseRepository     = new PrismaCourseRepository();
const studentRepository    = new PrismaStudentRepository();

export const createEnrollment = async (data) => {
  // Validar que el alumno existe
  const student = await studentRepository.findById(data.studentId);
  if (!student) throw new Error('Alumno no encontrado');

  // Validar que el curso existe y está activo
  const course = await courseRepository.findById(data.courseId);
  if (!course) throw new Error('Curso no encontrado');
  if (course.status !== 'ACTIVE') throw new Error('El curso no está activo');

  // Evitar inscripción duplicada (PENDING o CONFIRMED)
  const existing = await enrollmentRepository.findByStudent(data.studentId);
  const duplicate = existing.find(
    (e) => e.courseId === data.courseId &&
           (e.status === 'PENDING' || e.status === 'CONFIRMED')
  );
  if (duplicate) throw new Error('El alumno ya tiene una inscripción activa para este curso');

  // Para cursos presenciales verificar cupos disponibles
  if (course.type === 'PRESENCIAL' && course.maxSpots) {
    const confirmed = await courseRepository.countConfirmedEnrollments(course.id);
    if (confirmed >= course.maxSpots) {
      throw new Error('No hay cupos disponibles para este curso');
    }
  }

  return enrollmentRepository.create({
    studentId:       data.studentId,
    courseId:        data.courseId,
    status:          'PENDING',
    paymentMethod:   data.paymentMethod,
    paymentStatus:   'PENDING',
    amountEUR:       course.priceEUR,
    bankName:        data.bankName        || null,
    referenceNumber: data.referenceNumber || null,
    notes:           data.notes           || null,
  });
};

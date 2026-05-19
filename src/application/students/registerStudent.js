import bcrypt from 'bcryptjs';
import { PrismaStudentRepository } from '@/infrastructure/repositories/PrismaStudentRepository';

const studentRepository = new PrismaStudentRepository();

/**
 * Registro público de alumno (sitio frontal).
 * Solo requiere firstName, lastName, email, password.
 * Los campos extra (phone, idNumber, city, etc.) se completan
 * más tarde durante el flow de inscripción a un curso.
 */
export const registerStudent = async ({ firstName, lastName, email, password }) => {
  const existing = await studentRepository.findByEmail(email);
  if (existing) {
    throw new Error('Ya existe una cuenta registrada con ese correo');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return studentRepository.create({
    firstName: firstName.trim(),
    lastName:  lastName.trim(),
    email:     email.trim().toLowerCase(),
    password:  hashedPassword,
  });
};

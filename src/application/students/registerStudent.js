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
  const normalizedEmail = email.trim().toLowerCase();
  const hashedPassword  = await bcrypt.hash(password, 10);

  // Buscar incluyendo eliminados (el email es @unique a nivel DB)
  const existing = await studentRepository.findByEmailIncludingDeleted(normalizedEmail);

  if (existing && !existing.deletedAt) {
    // Cuenta activa con ese correo → bloquear
    throw new Error('Ya existe una cuenta registrada con ese correo');
  }

  if (existing && existing.deletedAt) {
    // Cuenta en la papelera con ese correo → reactivar con los datos nuevos
    await studentRepository.restore(existing.id);
    return studentRepository.update(existing.id, {
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      password:  hashedPassword,
    });
  }

  // Caso normal: crear cuenta nueva
  return studentRepository.create({
    firstName: firstName.trim(),
    lastName:  lastName.trim(),
    email:     normalizedEmail,
    password:  hashedPassword,
  });
};

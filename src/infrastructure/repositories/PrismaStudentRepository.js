import prisma from '@/lib/prisma';
import { IStudentRepository } from '@/domain/repositories/IStudentRepository';

export class PrismaStudentRepository extends IStudentRepository {
  // Lecturas: solo alumnos NO eliminados
  async findAll() {
    return prisma.student.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.student.findUnique({
      where: { id },
    });
  }

  // Busca por email SOLO entre activos (para validar email único en registro)
  async findByEmail(email) {
    return prisma.student.findFirst({
      where: { email, deletedAt: null },
    });
  }

  // Busca por email incluyendo eliminados (para reactivar al registrarse)
  async findByEmailIncludingDeleted(email) {
    return prisma.student.findUnique({
      where: { email },
    });
  }

  // Alumnos en la papelera
  async findDeleted() {
    return prisma.student.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async create(data) {
    return prisma.student.create({ data });
  }

  async update(id, data) {
    return prisma.student.update({
      where: { id },
      data,
    });
  }

  // Soft delete
  async delete(id) {
    return prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Restaurar desde la papelera
  async restore(id) {
    return prisma.student.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findWithEnrollments(id) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: true },
          orderBy: { enrolledAt: 'desc' },
        },
      },
    });
  }
}

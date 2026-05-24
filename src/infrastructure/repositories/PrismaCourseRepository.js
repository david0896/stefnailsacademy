import prisma from '@/lib/prisma';
import { ICourseRepository } from '@/domain/repositories/ICourseRepository';

export class PrismaCourseRepository extends ICourseRepository {
  // Lecturas: solo registros NO eliminados (deletedAt: null)
  async findAll() {
    return prisma.course.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.course.findUnique({
      where: { id },
    });
  }

  async findActive() {
    return prisma.course.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Cursos en la papelera (eliminados)
  async findDeleted() {
    return prisma.course.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async create(data) {
    return prisma.course.create({ data });
  }

  async update(id, data) {
    return prisma.course.update({
      where: { id },
      data,
    });
  }

  // Soft delete: marca deletedAt en vez de borrar
  async delete(id) {
    return prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Restaurar desde la papelera
  async restore(id) {
    return prisma.course.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async countConfirmedEnrollments(courseId) {
    return prisma.enrollment.count({
      where: { courseId, status: 'CONFIRMED', deletedAt: null },
    });
  }
}

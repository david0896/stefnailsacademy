import prisma from '@/lib/prisma';
import { IEnrollmentRepository } from '@/domain/repositories/IEnrollmentRepository';

export class PrismaEnrollmentRepository extends IEnrollmentRepository {
  async findAll(filters = {}) {
    const where = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.courseId) where.courseId = filters.courseId;

    return prisma.enrollment.findMany({
      where,
      include: {
        student: true,
        course: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
      },
    });
  }

  async findByCourse(courseId) {
    return prisma.enrollment.findMany({
      where: { courseId, deletedAt: null },
      include: { student: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findByStudent(studentId) {
    return prisma.enrollment.findMany({
      where: { studentId, deletedAt: null },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  // Inscripciones en la papelera
  async findDeleted() {
    return prisma.enrollment.findMany({
      where: { deletedAt: { not: null } },
      include: { student: true, course: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async create(data) {
    return prisma.enrollment.create({
      data,
      include: { student: true, course: true },
    });
  }

  async updateStatus(id, status, extra = {}) {
    return prisma.enrollment.update({
      where: { id },
      data: { status, ...extra },
    });
  }

  // Soft delete
  async delete(id) {
    return prisma.enrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Restaurar desde la papelera
  async restore(id) {
    return prisma.enrollment.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async countByStatus(status) {
    return prisma.enrollment.count({ where: { status, deletedAt: null } });
  }
}

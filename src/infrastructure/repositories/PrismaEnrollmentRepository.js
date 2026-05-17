import prisma from '@/lib/prisma';
import { IEnrollmentRepository } from '@/domain/repositories/IEnrollmentRepository';

export class PrismaEnrollmentRepository extends IEnrollmentRepository {
  async findAll(filters = {}) {
    const where = {};
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
      where: { courseId },
      include: { student: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findByStudent(studentId) {
    return prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
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

  async countByStatus(status) {
    return prisma.enrollment.count({ where: { status } });
  }
}

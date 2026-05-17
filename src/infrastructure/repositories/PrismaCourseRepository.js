import prisma from '@/lib/prisma';
import { ICourseRepository } from '@/domain/repositories/ICourseRepository';

export class PrismaCourseRepository extends ICourseRepository {
  async findAll() {
    return prisma.course.findMany({
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
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
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

  async delete(id) {
    return prisma.course.delete({
      where: { id },
    });
  }

  async countConfirmedEnrollments(courseId) {
    return prisma.enrollment.count({
      where: { courseId, status: 'CONFIRMED' },
    });
  }
}

import prisma from '@/lib/prisma';
import { IStudentRepository } from '@/domain/repositories/IStudentRepository';

export class PrismaStudentRepository extends IStudentRepository {
  async findAll() {
    return prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.student.findUnique({
      where: { id },
    });
  }

  async findByEmail(email) {
    return prisma.student.findUnique({
      where: { email },
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

  async delete(id) {
    return prisma.student.delete({ where: { id } });
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

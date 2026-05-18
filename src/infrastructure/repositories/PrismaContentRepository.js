import prisma from '@/lib/prisma';
import { IContentRepository } from '@/domain/repositories/IContentRepository';

export class PrismaContentRepository extends IContentRepository {
  async findAll() {
    return prisma.content.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key) {
    return prisma.content.findUnique({
      where: { key },
    });
  }

  async upsert(key, data) {
    return prisma.content.upsert({
      where: { key },
      update: data,
      create: { key, ...data },
    });
  }
}

import { PrismaContentRepository } from '@/infrastructure/repositories/PrismaContentRepository';

const contentRepository = new PrismaContentRepository();

export const updateContent = async (key, data) => {
  return contentRepository.upsert(key, data);
};

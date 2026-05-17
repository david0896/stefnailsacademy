import { PrismaContentRepository } from '@/infrastructure/repositories/PrismaContentRepository';

const contentRepository = new PrismaContentRepository();

export const getAllContent = async () => {
  return contentRepository.findAll();
};

export const getContentByKey = async (key) => {
  return contentRepository.findByKey(key);
};

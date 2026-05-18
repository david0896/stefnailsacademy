import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Lightweight query to keep Supabase free tier awake
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[health] DB ping failed:', error.message);
    return res.status(503).json({ status: 'error', message: error.message });
  }
}

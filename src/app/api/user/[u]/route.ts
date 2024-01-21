import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/trpc'
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username } = req.query;

  try {
    const userData = await db.members.findFirst({
      where: {
        username: username as string,
      },
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await db.$disconnect();
  }
}

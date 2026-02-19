import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

// GET /api/admin/users - Get all users with their credit info
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Fetch all users (excluding admin users if needed)
    const users = await db.collection('users')
      .find({ role: { $ne: 'admin' } })
      .project({
        _id: 1,
        name: 1,
        email: 1,
        'credits.balance': 1,
        'hero.levelName': 1,
        'stats.totalClasses': 1,
        createdAt: 1
      })
      .sort({ name: 1 })
      .toArray();

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || 'Unknown',
      email: user.email || '',
      credits: user.credits?.balance || 0,
      level: user.hero?.levelName || 'Trainee',
      totalClasses: user.stats?.totalClasses || 0,
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

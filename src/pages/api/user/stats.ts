import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/user/stats - Get user dashboard stats
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID required' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get user data
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate expiring credits (within 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expiringCredits = user.credits?.expiringCredits?.filter((credit: any) => {
      const expiryDate = new Date(credit.expiryDate);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    }) || [];

    const expiringAmount = expiringCredits.reduce((sum: number, credit: any) => sum + credit.amount, 0);
    const nearestExpiry = expiringCredits.length > 0 
      ? expiringCredits.sort((a: any, b: any) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0]
      : null;

    // Get class stats
    const stats = {
      credits: user.credits?.balance || 0,
      expiringCredits: expiringAmount,
      expiryDate: nearestExpiry ? new Date(nearestExpiry.expiryDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) : null,
      totalClasses: user.stats?.totalClasses || 0,
      muayThaiClasses: user.stats?.muayThaiClasses || 0,
      aerialClasses: user.stats?.aerialClasses || 0
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return res.status(500).json({ error: 'Failed to fetch user stats' });
  }
}

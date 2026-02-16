import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/credits - Get user credit balance and expiring credits
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

    // Calculate expiring credits
    const today = new Date();
    const expiringCredits = (user.credits?.expiringCredits || [])
      .filter((credit: any) => new Date(credit.expiryDate) >= today)
      .map((credit: any) => {
        const expiryDate = new Date(credit.expiryDate);
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          amount: credit.amount,
          expiryDate: expiryDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          daysLeft
        };
      })
      .sort((a: any, b: any) => a.daysLeft - b.daysLeft);

    const creditData = {
      balance: user.credits?.balance || 0,
      expiringCredits
    };

    return res.status(200).json(creditData);
  } catch (error) {
    console.error('Credits API error:', error);
    return res.status(500).json({ error: 'Failed to fetch credits' });
  }
}

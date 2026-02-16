import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/user/activity - Get recent user activity
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, limit = '10' } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID required' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get recent activities
    const activities = await db.collection('activities')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .toArray();

    // Format activities with relative time
    const formattedActivities = activities.map((activity) => {
      const diff = Date.now() - new Date(activity.createdAt).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      let timeAgo;
      if (hours < 1) {
        timeAgo = 'Just now';
      } else if (hours < 24) {
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (days === 1) {
        timeAgo = 'Yesterday';
      } else if (days < 7) {
        timeAgo = `${days} days ago`;
      } else {
        timeAgo = new Date(activity.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }

      return {
        _id: activity._id.toString(),
        action: activity.action,
        type: activity.type,
        time: timeAgo,
        createdAt: activity.createdAt
      };
    });

    return res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Activity API error:', error);
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/user/hero - Get user hero stats and achievements
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

    // Define achievement list
    const allAchievements = [
      { 
        id: 'first-strike', 
        label: 'First Strike', 
        desc: 'Complete your first Muay Thai class', 
        color: 'neonGreen' 
      },
      { 
        id: 'aerial-queen', 
        label: user.profile?.gender === 'male' ? 'Aerial King' : 'Aerial Queen', 
        desc: 'Master the Silk Climb', 
        color: 'neonPink' 
      },
      { 
        id: 'iron-body', 
        label: 'Iron Body', 
        desc: 'Attend 10 conditioning sessions', 
        color: 'white' 
      },
      { 
        id: 'early-bird', 
        label: 'Early Bird', 
        desc: 'Attend 5 morning classes', 
        color: 'neonGreen' 
      },
      { 
        id: 'sharp-shooter', 
        label: 'Sharp Shooter', 
        desc: 'Perfect technique rating', 
        color: 'white' 
      },
      { 
        id: 'loyalist', 
        label: 'Loyalist', 
        desc: 'Member for 6 months', 
        color: 'white' 
      },
    ];

    // Get user achievements
    const userAchievements = user.hero?.achievements || [];

    const achievements = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: userAchievements.includes(achievement.id)
    }));

    // Calculate level and stats
    const level = user.hero?.level || 1;
    const levelName = user.hero?.levelName || 'Beginner Warrior';
    const stats = {
      strength: user.stats?.strength || 0,
      agility: user.stats?.agility || 0,
      endurance: user.stats?.endurance || 0,
      flexibility: user.stats?.flexibility || 0
    };

    // Calculate progress to next level (simplified - you can make this more complex)
    const currentLevel = level;
    const experienceForNext = currentLevel * 100;
    const currentExperience = (user.stats?.totalClasses || 0) * 10;
    const progressPercent = Math.min((currentExperience / experienceForNext) * 100, 75); // 75% for animation

    const heroStats = {
      level,
      levelName,
      gender: user.profile?.gender || 'female',
      achievements,
      stats: [
        { label: 'Strength Level', value: stats.strength, max: 50, color: 'neonGreen' },
        { label: 'Agility Level', value: stats.agility, max: 50, color: 'neonPink' },
        { label: 'Endurance', value: stats.endurance, max: 50, color: 'neonGreen' },
        { label: 'Flexibility', value: stats.flexibility, max: 50, color: 'neonPink' }
      ],
      progressPercent
    };

    return res.status(200).json(heroStats);
  } catch (error) {
    console.error('Hero stats API error:', error);
    return res.status(500).json({ error: 'Failed to fetch hero stats' });
  }
}

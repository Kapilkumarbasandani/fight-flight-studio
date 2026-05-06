import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray();
    
    // Get users count
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    
    return res.status(200).json({
      success: true,
      message: 'MongoDB connected successfully!',
      database: 'fight-flight-studio',
      collections: collections.map(c => c.name),
      userCount,
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to MongoDB',
      error: error.message,
    });
  }
}

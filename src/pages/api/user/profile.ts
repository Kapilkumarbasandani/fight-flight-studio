import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const client = await clientPromise;
      const db = client.db('fight-flight-studio');
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { userId, profile } = req.body;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!profile) {
        return res.status(400).json({ error: 'Profile data is required' });
      }

      const client = await clientPromise;
      const db = client.db('fight-flight-studio');
      const usersCollection = db.collection('users');

      const updateData: any = {};
      
      if (profile.address !== undefined) {
        updateData['profile.address'] = profile.address;
      }
      
      if (profile.birthday !== undefined) {
        updateData['profile.birthday'] = profile.birthday;
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      );

      return res.status(200).json({ 
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

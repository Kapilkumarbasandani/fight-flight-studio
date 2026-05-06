import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/users - Get all users with their credit info
// DELETE /api/admin/users?id=xxx - Delete a user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
      const client = await clientPromise;
      const db = client.db('fight-flight-studio');
      // Delete the user and their associated data
      const result = await db.collection('users').deleteOne({ _id: objectId, role: { $ne: 'admin' } });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found or cannot delete admin users' });
      }
      // Clean up user's bookings
      await db.collection('bookings').deleteMany({ userId: id });
      await db.collection('credittransactions').deleteMany({ userId: id });
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Fetch all users (excluding admin users)
    const users = await db.collection('users')
      .find({ role: { $ne: 'admin' } })
      .project({
        _id: 1,
        name: 1,
        email: 1,
        'credits.balance': 1,
        'credits.expiringCredits': 1,
        creditExpiryDate: 1,
        expiryPaused: 1,
        pausedUntil: 1,
        'hero.levelName': 1,
        'stats.totalClasses': 1,
        createdAt: 1
      })
      .sort({ name: 1 })
      .toArray();

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name || 'Unknown',
      email: user.email || '',
      credits: user.credits?.balance || 0,
      expiringCredits: user.credits?.expiringCredits || [],
      creditExpiryDate: user.creditExpiryDate || null,
      expiryPaused: user.expiryPaused || false,
      pausedUntil: user.pausedUntil || null,
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

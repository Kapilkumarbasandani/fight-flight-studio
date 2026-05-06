import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/admin/expiry - Pause or resume credit expiry for a specific user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, userId, pausedUntil, adminId } = req.body;

    if (!action || !userId) {
      return res.status(400).json({ error: 'Action and userId are required' });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!['pause', 'resume'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "pause" or "resume"' });
    }

    if (action === 'pause' && !pausedUntil) {
      return res.status(400).json({ error: 'pausedUntil date is required for pause action' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Verify user exists
    const targetUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (action === 'pause') {
      // Pause expiry for this specific user only
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            expiryPaused: true,
            pausedUntil: pausedUntil,
            pausedAt: new Date(),
            pausedBy: adminId || 'admin',
            updatedAt: new Date()
          }
        }
      );

      // Log activity
      await db.collection('activities').insertOne({
        userId,
        action: `Credit expiry paused until ${pausedUntil} by admin`,
        type: 'expiry_paused',
        createdAt: new Date(),
        metadata: { pausedUntil, adminId }
      });

      return res.status(200).json({
        success: true,
        message: `Credit expiry paused until ${new Date(pausedUntil).toLocaleDateString()} for ${targetUser.name}`
      });
    } else {
      // Resume expiry for this specific user only
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            expiryPaused: false,
            updatedAt: new Date()
          },
          $unset: { pausedUntil: '', pausedAt: '', pausedBy: '' }
        }
      );

      // Log activity
      await db.collection('activities').insertOne({
        userId,
        action: `Credit expiry resumed by admin`,
        type: 'expiry_resumed',
        createdAt: new Date(),
        metadata: { adminId }
      });

      return res.status(200).json({
        success: true,
        message: `Credit expiry resumed for ${targetUser.name}`
      });
    }
  } catch (error) {
    console.error('Error managing expiry:', error);
    return res.status(500).json({ error: 'Failed to update expiry status' });
  }
}

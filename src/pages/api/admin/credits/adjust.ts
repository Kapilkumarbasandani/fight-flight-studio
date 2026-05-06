import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/admin/credits/adjust - Adjust user credits (add or deduct)
// GET  /api/admin/credits/adjust - Fetch recent admin adjustment history
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('fight-flight-studio');
      const history = await db.collection('credit_transactions')
        .find({ adminAdjustment: true })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      const formatted = history.map((t) => ({
        id: t._id.toString(),
        memberName: t.userName || t.userId,
        memberId: t.userId,
        amount: t.type === 'credit' ? t.amount : -t.amount,
        reason: (t.description || '').replace('Admin Adjustment: ', ''),
        adminName: t.adminName || 'Admin',
        timestamp: t.createdAt ? new Date(t.createdAt).toLocaleString() : 'Unknown'
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      console.error('[Admin Credits History] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, amount, reason, adminName } = req.body;

    console.log('[Admin Credits Adjust] Parsed data:', {
      userId,
      amount,
      reason,
      adminName
    });

    if (!userId || amount === undefined || !reason) {
      console.error('[Admin Credits Adjust] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get current user balance
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    console.log('[Admin Credits Adjust] User found:', user ? {
      id: user._id.toString(),
      name: user.name,
      currentBalance: user.credits?.balance || 0
    } : 'User not found');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentBalance = user.credits?.balance || 0;
    const newBalance = currentBalance + amount;

    console.log('[Admin Credits Adjust] Balance update:', {
      currentBalance,
      adjustment: amount,
      newBalance
    });

    // Prevent negative balance
    if (newBalance < 0) {
      console.error('[Admin Credits Adjust] Cannot deduct more than user has');
      return res.status(400).json({ error: 'Cannot deduct more credits than user has' });
    }

    // Update user credits
    const updateResult = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          'credits.balance': newBalance,
          updatedAt: new Date()
        } 
      }
    );

    console.log('[Admin Credits Adjust] User update result:', {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount
    });

    // Add credit transaction
    await db.collection('credit_transactions').insertOne({
      userId,
      userName: user.name || '',
      type: amount > 0 ? 'credit' : 'debit',
      amount: Math.abs(amount),
      description: `Admin Adjustment: ${reason}`,
      balanceAfter: newBalance,
      createdAt: new Date(),
      adminAdjustment: true,
      adminName: adminName || 'Admin'
    });

    console.log('[Admin Credits Adjust] Credit transaction created');

    // Add activity
    await db.collection('activities').insertOne({
      userId,
      action: `Credits ${amount > 0 ? 'added' : 'deducted'} by admin: ${reason}`,
      type: 'admin_adjustment',
      createdAt: new Date(),
      metadata: {
        amount,
        reason,
        adminName: adminName || 'Admin'
      }
    });

    console.log('[Admin Credits Adjust] Activity logged');

    const successMessage = `Successfully ${amount > 0 ? 'added' : 'deducted'} ${Math.abs(amount)} credits`;
    console.log('[Admin Credits Adjust] Success:', successMessage);

    return res.status(200).json({
      success: true,
      newBalance,
      message: successMessage
    });
  } catch (error) {
    console.error('[Admin Credits Adjust] Error:', error);
    return res.status(500).json({ error: 'Failed to adjust credits' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/payments/verify - Verify Razorpay payment and update credits
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, orderId, paymentId, packageId, credits, validityDays } = req.body;

    if (!userId || !orderId || !paymentId || !packageId || !credits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production, verify payment signature with Razorpay:
    // const crypto = require('crypto');
    // const signature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${orderId}|${paymentId}`)
    //   .digest('hex');
    // 
    // if (signature !== razorpay_signature) {
    //   return res.status(400).json({ error: 'Invalid payment signature' });
    // }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get current user
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentCredits = user.credits?.balance || 0;
    const newBalance = currentCredits + credits;

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (validityDays || 90));

    // Update user credits
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          'credits.balance': newBalance
        },
        $push: {
          'credits.expiringCredits': {
            amount: credits,
            expiryDate
          }
        } as any
      }
    );

    // Add credit transaction
    await db.collection('credit_transactions').insertOne({
      userId,
      type: 'credit',
      amount: credits,
      description: `Package Purchase: ${credits} Credits`,
      balanceAfter: newBalance,
      createdAt: new Date(),
      expiryDate,
      orderId,
      paymentId,
      invoiceUrl: `/invoices/${orderId}.pdf` // Mock invoice URL
    });

    // Add activity
    await db.collection('activities').insertOne({
      userId,
      action: `Purchased ${credits} class credits`,
      type: 'purchase',
      createdAt: new Date(),
      metadata: { orderId, paymentId, credits }
    });

    return res.status(200).json({ 
      success: true,
      newBalance,
      message: 'Payment verified and credits added successfully' 
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
}

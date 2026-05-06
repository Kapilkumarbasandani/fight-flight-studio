import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, amount, credits, packName, paymentMethod } = req.body;

    if (!userId || !amount || !credits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create payment record
    const payment = {
      userId: userId,
      userName: user.profile?.name || user.name || user.email,
      userEmail: user.email,
      amount: amount,
      credits: credits,
      packName: packName || `${credits} Credits`,
      paymentMethod: paymentMethod || 'UPI',
      status: 'pending', // pending, verified, rejected
      transactionId: null,
      upiId: null,
      screenshot: null,
      createdAt: new Date(),
      verifiedAt: null,
      verifiedBy: null,
      notes: ''
    };

    const result = await db.collection('payments').insertOne(payment);

    // Return payment details including QR code info
    return res.status(200).json({
      success: true,
      paymentId: result.insertedId.toString(),
      payment: {
        ...payment,
        _id: result.insertedId.toString()
      },
      paymentInfo: {
        upiId: '9849031891@okbizaxis',
        qrCodeUrl: '/uploads/QR.jpeg',
        amount: amount,
        note: `Credits purchase - ${credits} credits`
      }
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
}

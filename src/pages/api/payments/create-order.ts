import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST /api/payments/create-order - Create payment order for Razorpay
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, packageId, credits, price } = req.body;

    if (!userId || !packageId || !credits || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, you would integrate with Razorpay here:
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET
    // });
    // 
    // const order = await razorpay.orders.create({
    //   amount: price * 100, // Razorpay expects amount in paise
    //   currency: 'INR',
    //   receipt: `order_${Date.now()}`,
    //   notes: {
    //     userId,
    //     packageId,
    //     credits
    //   }
    // });

    // For now, return a mock order
    const mockOrder = {
      orderId: `order_${Date.now()}`,
      amount: price * 100,
      currency: 'INR',
      packageId,
      credits,
      userId
    };

    return res.status(200).json(mockOrder);
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
}

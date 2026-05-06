import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, transactionId, upiId, screenshot } = req.body;

    if (!paymentId || !transactionId) {
      return res.status(400).json({ error: 'Payment ID and transaction ID are required' });
    }

    // Validate transaction ID - accept 8-24 alphanumeric characters (covers all UPI/IMPS/NEFT formats)
    const utrPattern = /^[A-Za-z0-9]{8,24}$/;
    if (!utrPattern.test(transactionId.trim())) {
      return res.status(400).json({ 
        error: 'Invalid transaction ID. Please enter your UTR / reference number (8–24 alphanumeric characters).' 
      });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get payment details
    const payment = await db.collection('payments').findOne({ _id: new ObjectId(paymentId) });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Prevent re-submission of already processed payments
    if (payment.status === 'verified') {
      return res.status(400).json({ error: 'This payment has already been verified.' });
    }
    if (payment.status === 'submitted') {
      return res.status(400).json({ error: 'Payment already submitted. Awaiting admin verification.' });
    }

    // Check if transaction ID already used by another payment
    const existingPayment = await db.collection('payments').findOne({
      transactionId: transactionId.trim(),
      _id: { $ne: new ObjectId(paymentId) }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        error: 'This transaction ID has already been used. Please check your transaction details.' 
      });
    }

    // Mark payment as submitted (pending admin approval) — do NOT credit yet
    await db.collection('payments').updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          transactionId: transactionId.trim(),
          upiId: upiId || null,
          screenshot: screenshot || null,
          status: 'submitted',
          submittedAt: new Date(),
        }
      }
    );

    // Log activity
    await db.collection('activities').insertOne({
      userId: payment.userId,
      type: 'payment_submitted',
      action: `Payment submitted for ${payment.credits} credits (₹${payment.amount}) — awaiting admin verification`,
      metadata: {
        paymentId: paymentId,
        transactionId: transactionId.trim(),
        credits: payment.credits,
        amount: payment.amount
      },
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Payment submitted for verification. Credits will be added once the admin approves.',
    });
  } catch (error) {
    console.error('Error submitting payment:', error);
    return res.status(500).json({ error: 'Failed to process payment' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userRole, status } = req.query;

    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get payments sorted by creation date (newest first)
    const payments = await db.collection('payments')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // Format payments for frontend
    const formattedPayments = payments.map(payment => ({
      _id: payment._id.toString(),
      userId: payment.userId,
      userName: payment.userName,
      userEmail: payment.userEmail,
      amount: payment.amount,
      credits: payment.credits,
      packName: payment.packName,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      transactionId: payment.transactionId,
      upiId: payment.upiId,
      screenshot: payment.screenshot,
      createdAt: payment.createdAt,
      submittedAt: payment.submittedAt,
      verifiedAt: payment.verifiedAt,
      verifiedBy: payment.verifiedBy,
      notes: payment.notes
    }));

    return res.status(200).json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
}

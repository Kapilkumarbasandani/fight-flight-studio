import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/credits/history - Get credit transaction history
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, limit = '20' } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID required' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get transaction history
    const transactions = await db.collection('credit_transactions')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .toArray();

    const formattedTransactions = transactions.map((transaction) => ({
      _id: transaction._id.toString(),
      action: transaction.description,
      date: new Date(transaction.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      change: transaction.type === 'credit' ? `+${transaction.amount}` : `-${transaction.amount}`,
      balance: transaction.balanceAfter.toString(),
      type: transaction.type,
      invoiceUrl: transaction.invoiceUrl || null
    }));

    return res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error('Credit history API error:', error);
    return res.status(500).json({ error: 'Failed to fetch credit history' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userRole, userId: adminId } = req.query;

  // Check if user is admin
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  const client = await clientPromise;
  const db = client.db('fight-flight-studio');

  if (req.method === 'PUT') {
    // Verify or reject payment
    try {
      const { action, notes } = req.body;

      if (!['verify', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }

      const payment = await db.collection('payments').findOne({ _id: new ObjectId(id as string) });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (action === 'verify') {
        // Update payment status to verified
        await db.collection('payments').updateOne(
          { _id: new ObjectId(id as string) },
          {
            $set: {
              status: 'verified',
              verifiedAt: new Date(),
              verifiedBy: adminId,
              notes: notes || ''
            }
          }
        );

        // Add credits to user account
        const user = await db.collection('users').findOne({ _id: new ObjectId(payment.userId) });
        
        if (user) {
          const currentBalance = user.credits?.balance || 0;
          const newBalance = currentBalance + payment.credits;

          // Calculate expiry date based on credit package
          let validityDays = 90; // default
          if (payment.credits === 1) {
            validityDays = 7; // 1 week for Trainee
          } else if (payment.credits === 5) {
            validityDays = 30; // 1 month for Sidekick
          } else if (payment.credits === 20) {
            validityDays = 60; // 2 months for Superhero
          } else if (payment.credits === 50) {
            validityDays = 90; // 3 months for Immortal
          }

          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + validityDays);

          // Add to expiring credits array
          const expiringCredits = user.credits?.expiringCredits || [];
          expiringCredits.push({
            amount: payment.credits,
            purchaseDate: new Date(),
            expiryDate: expiryDate
          });

          await db.collection('users').updateOne(
            { _id: new ObjectId(payment.userId) },
            {
              $set: {
                'credits.balance': newBalance,
                'credits.expiringCredits': expiringCredits
              }
            }
          );

          // Create credit transaction record
          await db.collection('credit_transactions').insertOne({
            userId: payment.userId,
            type: 'credit',
            amount: payment.credits,
            balance: newBalance,
            description: `Credits purchased via ${payment.paymentMethod} - ${payment.packName}`,
            paymentId: payment._id.toString(),
            createdAt: new Date()
          });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Payment verified and credits added successfully'
        });
      } else {
        // Reject payment
        await db.collection('payments').updateOne(
          { _id: new ObjectId(id as string) },
          {
            $set: {
              status: 'rejected',
              verifiedAt: new Date(),
              verifiedBy: adminId,
              notes: notes || 'Payment rejected'
            }
          }
        );

        return res.status(200).json({ 
          success: true, 
          message: 'Payment rejected successfully'
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userRole } = req.query;

    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');

    // Get all users (excluding admins)
    const allUsers = await db.collection('users').find({ role: { $ne: 'admin' } }).toArray();
    
    // Calculate active users (users with credits > 0)
    const activeUsers = allUsers.filter(u => u.credits?.balance > 0);
    
    // Calculate paused users
    const pausedUsers = allUsers.filter(u => u.status === 'paused').map(u => ({
      id: u._id.toString(),
      name: u.profile?.name || u.name || 'Unknown',
      email: u.email,
      pausedDate: u.pausedAt ? new Date(u.pausedAt).toISOString().split('T')[0] : 'N/A',
      reason: u.pauseReason || 'Not specified'
    }));
    
    // Get expiring users (users with credits expiring in next 14 days)
    const today = new Date();
    const fourteenDaysFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    const expiringUsers = allUsers
      .filter(u => {
        const expiringCredits = u.credits?.expiringCredits || [];
        return expiringCredits.some((ec: any) => {
          const expiryDate = new Date(ec.expiryDate);
          return expiryDate >= today && expiryDate <= fourteenDaysFromNow && ec.amount > 0;
        });
      })
      .map(u => {
        const expiringCredits = u.credits?.expiringCredits || [];
        const nextExpiry = expiringCredits
          .filter((ec: any) => new Date(ec.expiryDate) >= today && ec.amount > 0)
          .sort((a: any, b: any) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];
        
        const expiryDate = new Date(nextExpiry?.expiryDate);
        const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: u._id.toString(),
          name: u.profile?.name || u.name || 'Unknown',
          email: u.email,
          expiryDate: expiryDate.toISOString().split('T')[0],
          daysRemaining,
          creditsRemaining: nextExpiry?.amount || 0
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 10);
    
    // Get active members with recent activity
    const recentBookings = await db.collection('bookings')
      .find({ status: 'confirmed' })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    
    const userActivityMap = new Map();
    recentBookings.forEach(booking => {
      const userId = booking.userId;
      if (!userActivityMap.has(userId)) {
        userActivityMap.set(userId, booking.createdAt);
      }
    });
    
    const activeMembers = activeUsers
      .filter(u => userActivityMap.has(u._id.toString()))
      .map(u => ({
        id: u._id.toString(),
        name: u.profile?.name || u.name || 'Unknown',
        email: u.email,
        joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A',
        credits: u.credits?.balance || 0,
        lastClass: userActivityMap.get(u._id.toString()) 
          ? new Date(userActivityMap.get(u._id.toString())).toISOString().split('T')[0] 
          : 'N/A'
      }))
      .sort((a, b) => new Date(b.lastClass).getTime() - new Date(a.lastClass).getTime())
      .slice(0, 10);
    
    // Get financial data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const startOfQuarter = new Date();
    startOfQuarter.setMonth(Math.floor(startOfMonth.getMonth() / 3) * 3);
    startOfQuarter.setDate(1);
    startOfQuarter.setHours(0, 0, 0, 0);
    
    const startOfYear = new Date();
    startOfYear.setMonth(0);
    startOfYear.setDate(1);
    startOfYear.setHours(0, 0, 0, 0);
    
    // Get transactions for different periods
    const getFinanceData = async (startDate: Date) => {
      const transactions = await db.collection('credit_transactions')
        .find({ 
          type: 'credit',
          createdAt: { $gte: startDate }
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      const totalTransactions = transactions.length;
      const totalCredits = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalRevenue = totalCredits * 150; // Assuming ₹150 per credit
      const averageTransaction = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
      
      const recentTransactions = transactions.slice(0, 10).map(t => ({
        id: t._id.toString(),
        date: new Date(t.createdAt).toISOString().split('T')[0],
        amount: (t.amount || 0) * 150,
        user: t.userId ? 'User' : 'Unknown',
        type: `${t.amount} Credits`
      }));
      
      return {
        totalTransactions,
        totalRevenue,
        averageTransaction,
        growth: 0, // Would need historical data to calculate
        transactions: recentTransactions
      };
    };
    
    const monthlyData = await getFinanceData(startOfMonth);
    const quarterlyData = await getFinanceData(startOfQuarter);
    const yearlyData = await getFinanceData(startOfYear);
    
    const insights = {
      userInsights: {
        totalActive: activeUsers.length,
        totalPaused: pausedUsers.length,
        totalUsers: allUsers.length,
        expiringUsers,
        pausedUsers,
        activeMembers
      },
      financeInsights: {
        monthly: monthlyData,
        quarterly: quarterlyData,
        yearly: yearlyData
      }
    };

    return res.status(200).json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return res.status(500).json({ error: 'Failed to fetch insights' });
  }
}

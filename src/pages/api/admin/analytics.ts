import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

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

    // Get total users
    const totalUsers = await db.collection('users').countDocuments();
    
    // Get total classes
    const totalClasses = await db.collection('classes').countDocuments({ active: true });
    
    // Get total bookings
    const totalBookings = await db.collection('bookings').countDocuments();
    
    // Get bookings this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const bookingsThisMonth = await db.collection('bookings').countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    // Get revenue from verified payments
    const verifiedPayments = await db.collection('payments').aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    
    const totalRevenue = verifiedPayments.length > 0 ? verifiedPayments[0].total : 0;
    
    // Get revenue this month from verified payments
    const revenueThisMonth = await db.collection('payments').aggregate([
      { $match: { status: 'verified', verifiedAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    
    const monthlyRevenue = revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0;
    
    // Get pending payment count
    const pendingPayments = await db.collection('payments').countDocuments({
      status: { $in: ['pending', 'submitted'] }
    });
    
    // Get active users (users with credits.balance > 0 and not admin)
    const activeUsers = await db.collection('users').countDocuments({
      'credits.balance': { $gt: 0 },
      role: { $ne: 'admin' }
    });
    
    // Get paused users (field expiryPaused: true on user doc)
    const pausedUsers = await db.collection('users').countDocuments({
      expiryPaused: true,
      role: { $ne: 'admin' }
    });

    // Credits expiring soon: users with balance > 0 whose creditExpiryDate OR any expiringCredits entry is within 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const now = new Date();
    const creditsExpiringSoon = await db.collection('users').countDocuments({
      role: { $ne: 'admin' },
      expiryPaused: { $ne: true },
      'credits.balance': { $gt: 0 },
      $or: [
        { creditExpiryDate: { $lte: sevenDaysFromNow, $gte: now } },
        { 'credits.expiringCredits.expiryDate': { $lte: sevenDaysFromNow, $gte: now } }
      ]
    });
    
    // Get class utilization
    const classes = await db.collection('classes').find({ active: true }).toArray();
    const underperformingClasses = [];
    let muayThaiCount = 0;
    let aerialCount = 0;
    let yogaCount = 0;
    let conditioningCount = 0;
    
    for (const classItem of classes) {
      const bookingCount = await db.collection('bookings').countDocuments({
        classId: classItem._id.toString(),
        status: 'confirmed'
      });
      
      // Count discipline distribution — normalize both hyphen and underscore formats
      const discipline = (classItem.type || classItem.discipline || '').toLowerCase().replace('-', '_');
      if (discipline === 'muay_thai') {
        muayThaiCount += bookingCount;
      } else if (discipline === 'aerial') {
        aerialCount += bookingCount;
      } else if (discipline === 'yoga') {
        yogaCount += bookingCount;
      } else if (discipline === 'conditioning') {
        conditioningCount += bookingCount;
      }
      
      const utilizationRate = classItem.capacity > 0 ? (bookingCount / classItem.capacity) * 100 : 0;
      
      if (utilizationRate < 50) {
        underperformingClasses.push({
          id: classItem._id.toString(),
          title: classItem.name,
          attendance: bookingCount,
          capacity: classItem.capacity,
          utilizationRate: Math.round(utilizationRate)
        });
      }
    }

    // Calculate discipline split percentage
    const totalDisciplineBookings = muayThaiCount + aerialCount + yogaCount + conditioningCount;
    const muayThaiPercent = totalDisciplineBookings > 0 ? Math.round((muayThaiCount / totalDisciplineBookings) * 100) : 0;
    const aerialPercent = totalDisciplineBookings > 0 ? Math.round((aerialCount / totalDisciplineBookings) * 100) : 0;
    const yogaPercent = totalDisciplineBookings > 0 ? Math.round((yogaCount / totalDisciplineBookings) * 100) : 0;
    const conditioningPercent = totalDisciplineBookings > 0 ? Math.round((conditioningCount / totalDisciplineBookings) * 100) : 0;

    // Calculate growth (mock for now - would need historical data)
    const analytics = {
      insights: {
        activeUsers: activeUsers,
        monthlyRevenue: monthlyRevenue,
        totalUsers: totalUsers,
        pausedUsers: pausedUsers,
        pendingPayments: pendingPayments,
        creditsExpiringSoon: creditsExpiringSoon
      },
      revenue: {
        total: totalRevenue,
        thisMonth: monthlyRevenue,
        growth: monthlyRevenue > 0 ? 12.5 : 0,
        trend: [monthlyRevenue * 0.7, monthlyRevenue * 0.85, monthlyRevenue * 0.9, monthlyRevenue]
      },
      attendance: {
        total: totalBookings,
        thisMonth: bookingsThisMonth,
        growth: bookingsThisMonth > 0 ? 8.3 : 0,
        trend: [bookingsThisMonth * 0.77, bookingsThisMonth * 0.90, bookingsThisMonth * 0.94, bookingsThisMonth]
      },
      packSales: {
        total: Math.floor(totalBookings / 5),
        thisMonth: Math.floor(bookingsThisMonth / 5),
        topPack: "Warrior Pack (10 credits)",
        trend: [Math.floor(bookingsThisMonth / 5) * 0.71, Math.floor(bookingsThisMonth / 5) * 0.86, Math.floor(bookingsThisMonth / 5) * 0.93, Math.floor(bookingsThisMonth / 5)]
      },
      disciplineSplit: {
        muayThai: muayThaiPercent,
        aerial: aerialPercent,
        yoga: yogaPercent,
        conditioning: conditioningPercent
      },
      underperformingClasses: underperformingClasses.slice(0, 5)
    };

    return res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

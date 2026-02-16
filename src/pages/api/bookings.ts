import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper to check if booking date/time has passed
function isBookingPast(bookingDate: string, bookingTime: string): boolean {
  const now = new Date();
  
  // Parse the booking date (format: "Feb 20, 2026" or similar)
  const dateObj = new Date(bookingDate);
  
  // Parse time
  const [timeStr, period] = bookingTime.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  let classHour = hours;
  
  if (period === 'PM' && hours !== 12) {
    classHour += 12;
  } else if (period === 'AM' && hours === 12) {
    classHour = 0;
  }
  
  dateObj.setHours(classHour, minutes, 0, 0);
  
  return now > dateObj;
}

// GET /api/bookings - Get user bookings (upcoming and past)
// POST /api/bookings - Create new booking
// PUT /api/bookings - Update booking (cancel/reschedule)
// DELETE /api/bookings - Cancel booking
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('fight-flight-studio');

  if (req.method === 'GET') {
    try {
      const { userId, type = 'all' } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID required' });
      }

      const bookings = await db.collection('bookings')
        .find({ userId })
        .sort({ date: -1, time: 1 })
        .toArray();

      // Filter bookings based on type
      let filteredBookings = bookings;
      
      if (type === 'upcoming') {
        filteredBookings = bookings.filter((booking) => {
          const isPast = isBookingPast(booking.date, booking.time);
          return !isPast && booking.status !== 'cancelled';
        });
      } else if (type === 'past') {
        filteredBookings = bookings.filter((booking) => {
          const isPast = isBookingPast(booking.date, booking.time);
          return isPast || booking.status === 'cancelled';
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formattedBookings = filteredBookings.map((booking) => {
        const bookingDate = new Date(booking.date);
        const diffDays = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        let dateLabel;
        if (diffDays === 0) {
          dateLabel = 'Today';
        } else if (diffDays === 1) {
          dateLabel = 'Tomorrow';
        } else if (diffDays < 0) {
          // Past dates
          dateLabel = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (diffDays < 7) {
          dateLabel = bookingDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        } else {
          dateLabel = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        return {
          _id: booking._id.toString(),
          classId: booking.classId,
          className: booking.className,
          classType: booking.classType,
          instructor: booking.instructor,
          date: dateLabel,
          fullDate: booking.date,
          time: booking.time,
          status: booking.status,
          creditsUsed: booking.creditsUsed,
          attended: booking.attended || false,
          daysUntil: diffDays
        };
      });

      return res.status(200).json(formattedBookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, classId, className, classType, instructor, date, time, creditsUsed } = req.body;

      if (!userId || !classId || !className || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user has enough credits
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentCredits = user.credits?.balance || 0;
      if (currentCredits < creditsUsed) {
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      // Check class capacity
      const classData = await db.collection('classes').findOne({ _id: new ObjectId(classId) });
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      const currentBookings = await db.collection('bookings').countDocuments({
        classId,
        date,
        status: { $in: ['confirmed', 'waitlist'] }
      });

      const status = currentBookings >= classData.capacity ? 'waitlist' : 'confirmed';

      // Create booking
      const booking = {
        userId,
        classId,
        className,
        classType,
        instructor,
        date,
        time,
        status,
        creditsUsed,
        createdAt: new Date()
      };

      const result = await db.collection('bookings').insertOne(booking);

      // Deduct credits if confirmed
      if (status === 'confirmed') {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { 'credits.balance': -creditsUsed } }
        );

        // Add credit transaction
        await db.collection('credit_transactions').insertOne({
          userId,
          type: 'debit',
          amount: creditsUsed,
          description: `Class Booking: ${className}`,
          balanceAfter: currentCredits - creditsUsed,
          createdAt: new Date()
        });

        // Add activity
        await db.collection('activities').insertOne({
          userId,
          action: `Booked ${className}`,
          type: 'booking',
          createdAt: new Date(),
          metadata: { bookingId: result.insertedId.toString() }
        });
      }

      return res.status(201).json({ 
        _id: result.insertedId.toString(),
        ...booking,
        status 
      });
    } catch (error) {
      console.error('Create booking error:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { bookingId, userId } = req.body;

      if (!bookingId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get booking
      const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Update booking status
      await db.collection('bookings').updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { status: 'cancelled' } }
      );

      // Refund credits if booking was confirmed
      if (booking.status === 'confirmed') {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        const currentCredits = user?.credits?.balance || 0;

        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { 'credits.balance': booking.creditsUsed } }
        );

        // Add credit transaction
        await db.collection('credit_transactions').insertOne({
          userId,
          type: 'credit',
          amount: booking.creditsUsed,
          description: `Booking Cancelled: ${booking.className}`,
          balanceAfter: currentCredits + booking.creditsUsed,
          createdAt: new Date()
        });

        // Add activity
        await db.collection('activities').insertOne({
          userId,
          action: `Cancelled ${booking.className}`,
          type: 'booking',
          createdAt: new Date()
        });
      }

      return res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      console.error('Cancel booking error:', error);
      return res.status(500).json({ error: 'Failed to cancel booking' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

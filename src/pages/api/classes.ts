import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

// Helper to check if class time has passed for current day
function hasClassPassed(day: string, time: string): boolean {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDayName = daysOfWeek[currentDayIndex];
  const classDayIndex = daysOfWeek.indexOf(day);
  
  // If it's the same day, check time
  if (day === currentDayName) {
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    let classHour = hours;
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      classHour += 12;
    } else if (period === 'AM' && hours === 12) {
      classHour = 0;
    }
    
    const classTime = new Date(now);
    classTime.setHours(classHour, minutes, 0, 0);
    
    return now > classTime;
  }
  
  // For different days, only hide if it's earlier in the same week
  // Classes loop weekly, so we never truly hide a recurring class
  // We only check if today's classes have passed
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('fight-flight-studio');
      const classesCollection = db.collection('classes');

      const allClasses = await classesCollection
        .find({ active: true })
        .sort({ day: 1, time: 1 })
        .toArray();

      // Filter out classes that have already passed this week
      const upcomingClasses = allClasses.filter((cls: any) => {
        return !hasClassPassed(cls.day, cls.time);
      });

      return res.status(200).json(upcomingClasses);
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      return res.status(500).json({ error: 'Failed to fetch classes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

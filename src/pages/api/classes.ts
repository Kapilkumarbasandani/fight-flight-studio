import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

// Helper to check if class time has passed for current day
function hasClassPassed(day: string, time: string): boolean {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const currentDayName = daysOfWeek[now.getDay()];

  // Only filter classes on the current day whose time has already passed
  if (day !== currentDayName) return false;

  const [timeStr, period] = (time || '').split(' ');
  if (!timeStr) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  let classHour = hours;
  if (period === 'PM' && hours !== 12) classHour += 12;
  if (period === 'AM' && hours === 12) classHour = 0;

  const classTime = new Date(now);
  classTime.setHours(classHour, minutes || 0, 0, 0);
  return now > classTime;
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

      // ?view=all → return every active class (used by home page schedule)
      // default    → filter out today's already-passed classes (used by app booking)
      const { view } = req.query;
      const result = view === 'all'
        ? allClasses
        : allClasses.filter((cls: any) => !hasClassPassed(cls.day, cls.time));

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      return res.status(200).json([]);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

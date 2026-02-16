import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let userId, userRole;

    // For GET requests, get auth from query params
    if (req.method === 'GET') {
      userId = req.query.userId;
      userRole = req.query.userRole;
    } else {
      // For other methods, get from body
      userId = req.body.userId;
      userRole = req.body.userRole;
    }

    // Check if user is admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const classesCollection = db.collection('classes');

    if (req.method === 'POST') {
      const { classData } = req.body;
      console.log('📝 POST /api/admin/classes - classData:', classData);

      if (!classData) {
        console.error('❌ No class data provided');
        return res.status(400).json({ error: 'Class data is required' });
      }

      const newClass = {
        ...classData,
        bookedCount: 0, // Initialize booked count
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('💾 Attempting to insert class:', newClass);

      const result = await classesCollection.insertOne(newClass);
      console.log('✅ Insert result:', result);
      console.log('📌 Inserted ID:', result.insertedId);

      // Verify it was saved
      const savedClass = await classesCollection.findOne({ _id: result.insertedId });
      console.log('🔍 Verification - Saved class:', savedClass);

      return res.status(201).json({
        message: 'Class created successfully',
        classId: result.insertedId,
        verified: !!savedClass
      });
    } else if (req.method === 'PUT') {
      const { classId, classData } = req.body;

      if (!classId || !classData) {
        return res.status(400).json({ error: 'Class ID and data are required' });
      }

      const updateData = {
        ...classData,
        updatedAt: new Date(),
      };

      const result = await classesCollection.updateOne(
        { _id: new ObjectId(classId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Class not found' });
      }

      return res.status(200).json({ message: 'Class updated successfully' });
    } else if (req.method === 'DELETE') {
      const { classId } = req.body;

      if (!classId) {
        return res.status(400).json({ error: 'Class ID is required' });
      }

      // Soft delete by setting active to false
      const result = await classesCollection.updateOne(
        { _id: new ObjectId(classId) },
        { $set: { active: false, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Class not found' });
      }

      return res.status(200).json({ message: 'Class deleted successfully' });
    } else if (req.method === 'GET') {
      // Get all classes including inactive ones for admin
      const classes = await classesCollection
        .find({})
        .sort({ day: 1, time: 1 })
        .toArray();

      return res.status(200).json(classes);
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('Error managing classes:', error);
    return res.status(500).json({ error: 'Failed to manage classes' });
  }
}

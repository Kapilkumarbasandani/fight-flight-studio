import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/forms/submissions - Get user form submissions
// POST /api/forms/submissions - Submit a form
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('fight-flight-studio');

  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID required' });
      }

      // Get user's form submissions
      const submissions = await db.collection('form_submissions')
        .find({ userId })
        .toArray();

      // Get user data for formsCompleted array
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      const completedFormIds = user?.formsCompleted || [];

      // Get available forms
      const allForms = [
        { 
          id: 'waiver', 
          title: 'Member Waiver', 
          description: 'Required liability waiver for all members',
          required: true,
          fields: ['Full Name', 'Date of Birth', 'Emergency Contact', 'Signature']
        },
        { 
          id: 'health', 
          title: 'Health Questionnaire', 
          description: 'Medical history and fitness assessment',
          required: true,
          fields: ['Medical History', 'Current Medications', 'Injuries', 'Fitness Level']
        },
        { 
          id: 'emergency', 
          title: 'Emergency Contact Form', 
          description: 'Contact information for emergencies',
          required: true,
          fields: ['Emergency Contact Name', 'Relationship', 'Phone Number']
        },
        { 
          id: 'media', 
          title: 'Photo/Video Release', 
          description: 'Media consent for marketing materials',
          required: false,
          fields: ['Consent Agreement', 'Signature']
        },
        { 
          id: 'training', 
          title: 'Private Training Interest', 
          description: 'Request one-on-one coaching sessions',
          required: false,
          fields: ['Training Goals', 'Preferred Schedule', 'Experience Level']
        }
      ];

      const formsStatus = allForms.map(form => {
        const submission = submissions.find((s: any) => s.formId === form.id);
        const isCompleted = completedFormIds.includes(form.id);
        
        return {
          ...form,
          status: isCompleted ? 'completed' : 'pending',
          date: submission 
            ? `Submitted on ${new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            : form.required ? 'Not yet completed' : 'Optional form',
          submissionId: submission?._id?.toString()
        };
      });

      const requiredFormsCompleted = allForms
        .filter(f => f.required)
        .every(f => completedFormIds.includes(f.id));

      return res.status(200).json({
        forms: formsStatus,
        allRequiredCompleted: requiredFormsCompleted
      });
    } catch (error) {
      console.error('Get form submissions error:', error);
      return res.status(500).json({ error: 'Failed to fetch form submissions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, formId, formData, signature } = req.body;

      if (!userId || !formId || !formData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user exists
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create form submission
      const submission = {
        userId,
        formId,
        formData,
        signature,
        submittedAt: new Date()
      };

      const result = await db.collection('form_submissions').insertOne(submission);

      // Update user's completed forms list
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { formsCompleted: formId } }
      );

      // Add activity
      const formTitles: Record<string, string> = {
        waiver: 'Member Waiver',
        health: 'Health Questionnaire',
        emergency: 'Emergency Contact Form',
        media: 'Photo/Video Release',
        training: 'Private Training Interest'
      };

      await db.collection('activities').insertOne({
        userId,
        action: `Completed ${formTitles[formId] || 'form'}`,
        type: 'other',
        createdAt: new Date()
      });

      return res.status(201).json({
        _id: result.insertedId.toString(),
        ...submission,
        message: 'Form submitted successfully'
      });
    } catch (error) {
      console.error('Submit form error:', error);
      return res.status(500).json({ error: 'Failed to submit form' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/forms - Get available forms
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const forms = [
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

    return res.status(200).json(forms);
  } catch (error) {
    console.error('Forms API error:', error);
    return res.status(500).json({ error: 'Failed to fetch forms' });
  }
}

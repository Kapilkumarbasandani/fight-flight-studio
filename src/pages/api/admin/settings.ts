import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

// GET /api/admin/settings — get studio info
// PUT /api/admin/settings — update studio info
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const col = db.collection('studioinfo');

    if (req.method === 'GET') {
      const doc = await col.findOne({});
      if (!doc) return res.status(404).json({ error: 'Not found' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...info } = doc as any;
      return res.status(200).json(info);
    }

    if (req.method === 'PUT') {
      const { name, address, phone, email, googleMapsUrl, googleMapsEmbed, social } = req.body;
      const update: Record<string, any> = { updatedAt: new Date() };
      if (name !== undefined) update.name = name;
      if (address !== undefined) update.address = address;
      if (phone !== undefined) update.phone = phone;
      if (email !== undefined) update.email = email;
      if (googleMapsUrl !== undefined) update.googleMapsUrl = googleMapsUrl;
      if (googleMapsEmbed !== undefined) update.googleMapsEmbed = googleMapsEmbed;
      if (social !== undefined) update.social = social;

      await col.updateOne({}, { $set: update }, { upsert: true });
      return res.status(200).json({ message: 'Settings updated' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

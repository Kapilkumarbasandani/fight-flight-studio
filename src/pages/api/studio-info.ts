import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

const DEFAULT_INFO = {
  name: 'Fight & Flight',
  address: '4th Floor, 538, Chinmaya Mission Hospital Rd, Hoysala Nagar, Indiranagar, Bengaluru, Karnataka 560038',
  phone: '+91 7207831607',
  email: 'hello@fightandflight.com',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=4th+Floor+538+Chinmaya+Mission+Hospital+Rd+Hoysala+Nagar+Indiranagar+Bengaluru+Karnataka+560038',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8839654321!2d77.64089!3d12.97158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0x14f3d6c7f67c7c7!2sChinmaya%20Mission%20Hospital%20Rd%2C%20Hoysala%20Nagar%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka%20560038!5e0!3m2!1sen!2sin!4v1234567890',
  social: { instagram: '#', facebook: '#', twitter: '#' },
};

// GET /api/studio-info — Studio contact details and social links
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const doc = await db.collection('studioinfo').findOne({});

    if (!doc) {
      // Seed default on first load
      await db.collection('studioinfo').insertOne({ ...DEFAULT_INFO, createdAt: new Date() });
      return res.status(200).json(DEFAULT_INFO);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...info } = doc as any;
    return res.status(200).json(info);
  } catch (error) {
    console.error('studio-info API error:', error);
    return res.status(200).json(DEFAULT_INFO);
  }
}

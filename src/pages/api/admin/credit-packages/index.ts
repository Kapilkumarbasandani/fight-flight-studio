import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

// GET /api/admin/credit-packages — list all packages
// POST /api/admin/credit-packages — create a new package
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const col = db.collection('creditpackages');

    if (req.method === 'GET') {
      const pkgs = await col.find({}).sort({ sortOrder: 1 }).toArray();
      return res.status(200).json(pkgs.map(p => ({ ...p, id: p._id.toString() })));
    }

    if (req.method === 'POST') {
      const { name, credits, price, validityDays, description, note, popular } = req.body;
      if (!name || !credits || !price || !validityDays) {
        return res.status(400).json({ error: 'name, credits, price, validityDays are required' });
      }
      const count = await col.countDocuments();
      const doc = {
        name,
        credits: Number(credits),
        price: Number(price),
        perClass: Math.round(Number(price) / Number(credits)),
        validityDays: Number(validityDays),
        description: description ?? '',
        note: note ?? '',
        popular: popular ?? false,
        active: true,
        sortOrder: count,
        createdAt: new Date(),
      };
      const result = await col.insertOne(doc);
      return res.status(201).json({ ...doc, id: result.insertedId.toString() });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin credit-packages error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

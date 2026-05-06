import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/admin/credit-packages/[id] — update a package
// DELETE /api/admin/credit-packages/[id] — delete a package
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Package ID is required' });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return res.status(400).json({ error: 'Invalid package ID' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const col = db.collection('creditpackages');

    if (req.method === 'PUT') {
      const { name, credits, price, validityDays, description, note, popular, active, sortOrder } = req.body;
      const update: Record<string, any> = { updatedAt: new Date() };
      if (name !== undefined) update.name = name;
      if (credits !== undefined) {
        update.credits = Number(credits);
        if (price !== undefined) update.perClass = Math.round(Number(price) / Number(credits));
      }
      if (price !== undefined) {
        update.price = Number(price);
        const c = credits ?? (await col.findOne({ _id: objectId }))?.credits ?? 1;
        update.perClass = Math.round(Number(price) / Number(c));
      }
      if (validityDays !== undefined) update.validityDays = Number(validityDays);
      if (description !== undefined) update.description = description;
      if (note !== undefined) update.note = note;
      if (popular !== undefined) update.popular = popular;
      if (active !== undefined) update.active = active;
      if (sortOrder !== undefined) update.sortOrder = Number(sortOrder);

      const result = await col.updateOne({ _id: objectId }, { $set: update });
      if (result.matchedCount === 0) return res.status(404).json({ error: 'Package not found' });
      return res.status(200).json({ message: 'Package updated' });
    }

    if (req.method === 'DELETE') {
      const result = await col.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Package not found' });
      return res.status(200).json({ message: 'Package deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin credit-package [id] error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

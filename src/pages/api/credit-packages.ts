import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

const DEFAULT_PACKAGES = [
  { id: 'trainee', name: 'The Trainee', credits: 1, price: 850, perClass: 850, popular: false, validityDays: 7, description: 'First-time explorers', note: 'Aerial classes require 2 credits to start', sortOrder: 0 },
  { id: 'sidekick', name: 'The Sidekick', credits: 5, price: 4000, perClass: 800, popular: false, validityDays: 30, description: 'For busy professionals', note: 'Flexible, low-commitment', sortOrder: 1 },
  { id: 'superhero', name: 'The Superhero', credits: 20, price: 12000, perClass: 600, popular: false, validityDays: 60, description: 'Ideal for regular training', note: 'Best balance of value + progress', sortOrder: 2 },
  { id: 'immortal', name: 'The Immortal', credits: 50, price: 25000, perClass: 500, popular: false, validityDays: 90, description: 'For true community members', note: 'Best value - Almost lives at the studio', sortOrder: 3 },
];

// GET /api/credit-packages - Get available credit packages from DB
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const pkgs = await db.collection('creditpackages').find({ active: { $ne: false } }).sort({ sortOrder: 1 }).toArray();

    if (pkgs.length === 0) {
      // Seed defaults on first load
      await db.collection('creditpackages').insertMany(
        DEFAULT_PACKAGES.map(p => ({ ...p, active: true, createdAt: new Date() }))
      );
      return res.status(200).json(DEFAULT_PACKAGES);
    }

    const packages = pkgs.map(p => ({
      id: p._id.toString(),
      name: p.name,
      credits: p.credits,
      price: p.price,
      perClass: p.perClass ?? Math.round(p.price / p.credits),
      popular: p.popular ?? false,
      validityDays: p.validityDays,
      description: p.description ?? '',
      note: p.note ?? '',
      sortOrder: p.sortOrder ?? 0,
    }));

    return res.status(200).json(packages);
  } catch (error) {
    console.error('Credit packages API error:', error);
    // Fall back to defaults so the UI never breaks when DB is unavailable
    return res.status(200).json(DEFAULT_PACKAGES);
  }
}

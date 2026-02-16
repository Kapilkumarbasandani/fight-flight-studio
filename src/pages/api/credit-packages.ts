import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/credit-packages - Get available credit packages
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Credit packages configuration
    const packages = [
      { 
        id: '5-pack', 
        credits: 5, 
        price: 125, 
        perClass: 25, 
        popular: false,
        validityDays: 90 
      },
      { 
        id: '10-pack', 
        credits: 10, 
        price: 220, 
        perClass: 22, 
        popular: true,
        validityDays: 120 
      },
      { 
        id: '20-pack', 
        credits: 20, 
        price: 400, 
        perClass: 20, 
        popular: false,
        validityDays: 180 
      },
    ];

    return res.status(200).json(packages);
  } catch (error) {
    console.error('Credit packages API error:', error);
    return res.status(500).json({ error: 'Failed to fetch credit packages' });
  }
}

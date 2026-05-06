import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/offerings — Studio discipline offerings
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    muayThai: [
      {
        icon: 'Flame',
        title: 'STRIKING FUNDAMENTALS',
        description: 'Master the art of eight limbs. Precision, power, technique.'
      },
      {
        icon: 'Zap',
        title: 'CONDITIONING & COMBAT',
        description: 'High-intensity training that builds warriors, not just athletes.'
      },
      {
        icon: 'Trophy',
        title: 'SPARRING SESSIONS',
        description: 'Test your limits. Controlled combat with experienced fighters.'
      }
    ],
    aerial: [
      {
        icon: 'Bird',
        title: 'HOOP & HAMMOCK',
        description: 'Suspended elegance. Strength wrapped in graceful movement.'
      },
      {
        icon: 'Heart',
        title: 'CHOREOGRAPHY',
        description: 'Movement as art. Express, flow, and defy gravity with style.'
      },
      {
        icon: 'Star',
        title: 'FLEXIBILITY & FLOW',
        description: "Unlock your body's potential. Stretch, bend, soar."
      }
    ]
  });
}

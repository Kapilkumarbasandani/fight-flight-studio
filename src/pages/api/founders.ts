import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/founders — Studio founders / instructors
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json([
    {
      id: 1,
      name: 'Tinsley Nulph',
      title: 'Certified Aerial Dance Instructor',
      image: '/founder1.gif',
      bio: 'Certified Aerial Dance Instructor bringing grace and strength to the air.',
      fullBio: 'Tinsley Nulph is a certified aerial dance instructor who has mastered the art of movement in the air. With expertise in various aerial disciplines, Tinsley creates transformative experiences that blend technical precision with artistic expression. Her classes at Fight & Flight empower students to defy gravity while building strength, flexibility, and confidence.',
      color: 'neonGreen'
    },
    {
      id: 2,
      name: 'Shaleena Saraogi',
      title: 'Certified Muay Thai Instructor',
      image: '/founder2.gif',
      bio: 'Certified Muay Thai Instructor bringing authentic fight training to Bangalore.',
      fullBio: 'Shaleena Saraogi is a certified Muay Thai instructor with years of experience in the art of eight limbs. Her passion for martial arts and dedication to teaching has transformed countless students into confident fighters. At Fight & Flight, Shaleena brings authenticity, discipline, and a deep respect for traditional Muay Thai while making it accessible to all skill levels.',
      color: 'neonPink'
    }
  ]);
}

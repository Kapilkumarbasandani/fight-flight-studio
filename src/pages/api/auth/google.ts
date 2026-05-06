import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import type { User } from '@/models/User';

/**
 * Verifies a Google ID token using Google's public tokeninfo endpoint,
 * then finds or creates the matching user in MongoDB.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ success: false, message: 'Missing Google credential' });
  }

  try {
    // Verify the token with Google
    const tokenRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!tokenRes.ok) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const payload = await tokenRes.json();

    // Basic audience check — ensure the token was issued for this app
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && payload.aud !== clientId) {
      return res.status(401).json({ success: false, message: 'Token audience mismatch' });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'No email in Google token' });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const usersCollection = db.collection<User>('users');

    // Find existing user by email
    let user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user — no password needed for OAuth users
      const newUser: User = {
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        whatsapp: '',
        password: `google_oauth_${googleId}`, // non-login sentinel
        createdAt: new Date(),
        role: 'user',
        credits: { balance: 0, expiringCredits: [] },
        profile: {
          profilePicture: picture || '',
        },
      };
      const result = await usersCollection.insertOne(newUser as any);
      user = { ...newUser, _id: result.insertedId.toString() } as any;
    }

    return res.status(200).json({
      success: true,
      message: 'Signed in with Google',
      user: {
        _id: user._id?.toString(),
        name: user.name,
        email: user.email,
        phone: user.whatsapp || '',
        createdAt: user.createdAt,
        membership: user.membership,
        role: user.role || 'user',
        credits: user.credits || { balance: 0, lifetime: 0 },
        profile: user.profile,
      },
    });
  } catch (error: any) {
    console.error('Google auth error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

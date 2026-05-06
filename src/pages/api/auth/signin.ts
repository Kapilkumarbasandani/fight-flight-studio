import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import type { User } from '@/models/User';

// ─── Dev-only test accounts ────────────────────────────────────────────────
// These only work in development and are ignored in production.
const DEV_TEST_USERS: Record<string, { password: string; user: any }> = {
  'test5': {
    password: 'Qwerty@123',
    user: {
      _id: 'dev-test-user-001',
      name: 'Test5',
      email: 'test5@fightflight.local',
      phone: '9999999999',
      gender: '',
      createdAt: new Date('2026-01-01'),
      role: 'user',
      credits: { balance: 10, lifetime: 10 },
      membership: null,
    },
  },
};
// ───────────────────────────────────────────────────────────────────────────

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // ── Dev test user shortcut (development only) ──────────────────────────
    if (process.env.NODE_ENV === 'development') {
      const key = email.toLowerCase().trim();
      const testEntry = DEV_TEST_USERS[key];
      if (testEntry && password === testEntry.password) {
        return res.status(200).json({
          success: true,
          message: 'Signed in successfully (dev test user)',
          user: testEntry.user,
        });
      }
    }
    // ───────────────────────────────────────────────────────────────────────

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const usersCollection = db.collection<User>('users');

    // Find user by email or username (name field)
    const user = await usersCollection.findOne({
      $or: [
        { email: email.toLowerCase() },
        { name: email },                 // allow signing in with display name
      ],
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Return success with user data (without password)
    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      user: {
        _id: user._id?.toString(),
        // name: user.profile?.name || user.name || '',
        name: user.name || '',
        email: user.email,
        // phone: user.profile?.phone || user.whatsapp || '',
        phone: user.whatsapp || '',
        gender: user.profile?.gender || '',
        createdAt: user.createdAt,
        membership: user.membership,
        role: user.role || 'user',
        credits: user.credits || { balance: 0, lifetime: 0 },
      },
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

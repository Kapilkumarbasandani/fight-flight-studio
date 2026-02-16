import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import type { User } from '@/models/User';

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

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const usersCollection = db.collection<User>('users');

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    
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
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        createdAt: user.createdAt,
        membership: user.membership,
        role: user.role || 'user',
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

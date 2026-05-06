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
    const { name, email, whatsapp, password } = req.body;

    // Validate required fields
    if (!name || !email || !whatsapp || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      name,
      email: email.toLowerCase(),
      whatsapp,
      password: hashedPassword,
      createdAt: new Date(),
      role: 'user',
    };

    const result = await usersCollection.insertOne(newUser);

    // Return success without password
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        whatsapp: newUser.whatsapp,
        createdAt: newUser.createdAt,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

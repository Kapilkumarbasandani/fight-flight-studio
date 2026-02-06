import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, whatsapp, password } = body;

    // Validate input
    if (!name || !email || !whatsapp || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      whatsapp,
      password,
    });

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { success: true, message: 'User registered successfully', user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred during signup' },
      { status: 500 }
    );
  }
}

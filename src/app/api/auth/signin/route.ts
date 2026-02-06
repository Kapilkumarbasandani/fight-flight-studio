import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create user response without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { success: true, message: 'Sign in successful', user: userResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred during sign in' },
      { status: 500 }
    );
  }
}

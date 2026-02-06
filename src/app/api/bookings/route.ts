import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, classTitle, discipline, date, time, duration, instructor, credits } = body;

    // Validate input
    if (!userId || !classTitle || !discipline || !date || !time || !duration || !instructor || !credits) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Create new booking
    const booking = await Booking.create({
      userId,
      classTitle,
      discipline,
      date,
      time,
      duration,
      instructor,
      credits,
      status: 'booked',
    });

    return NextResponse.json(
      { success: true, message: 'Class booked successfully', booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred during booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all bookings for user
    const bookings = await Booking.find({ userId }).sort({ date: -1 });

    return NextResponse.json(
      { success: true, bookings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

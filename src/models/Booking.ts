import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  classTitle: string;
  discipline: 'muay-thai' | 'aerial';
  date: Date;
  time: string;
  duration: number;
  instructor: string;
  credits: number;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: Date;
}

const BookingSchema = new mongoose.Schema<IBooking>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classTitle: {
    type: String,
    required: true,
  },
  discipline: {
    type: String,
    enum: ['muay-thai', 'aerial'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

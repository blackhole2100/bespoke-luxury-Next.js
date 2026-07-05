import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  service: 'in-store' | 'virtual' | 'home-visit';
  date: string;          // ISO date string e.g. "2025-09-15"
  time: string;          // e.g. "14:00"
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, required: true, trim: true },
    service: { type: String, enum: ['in-store', 'virtual', 'home-visit'], required: true },
    date:    { type: String, required: true },
    time:    { type: String, required: true },
    notes:   { type: String, default: '' },
    status:  { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

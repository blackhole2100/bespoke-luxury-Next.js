import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone, service, date, time, notes } = body;

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ success: false, error: 'All required fields must be provided.' }, { status: 400 });
    }

    const booking = await Booking.create({ name, email, phone, service, date, time, notes: notes || '' });
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    console.error('[GET /api/bookings]', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

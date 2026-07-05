import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser || tokenUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }
    
    // Fetch all users (excluding passwords)
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error('Admin Fetch Users API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

const updateStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required.'),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered']),
});

// GET: Fetch all system orders (Admin Only)
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
    
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('Admin Fetch Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// PUT: Modify order status (Admin Only)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser || tokenUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { orderId, status } = parsed.data;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      );
    }
    
    order.status = status;
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error: any) {
    console.error('Admin Update Order Status API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

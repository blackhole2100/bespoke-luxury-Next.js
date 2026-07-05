import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
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
    
    // 1. Total User Count
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    // 2. Total Products Count
    const totalProducts = await Product.countDocuments();
    
    // 3. Total Orders Count
    const totalOrders = await Order.countDocuments();
    
    // 4. Calculate Total Revenue using Aggregation (only for non-Pending or all active orders)
    const revenueAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);
    
    const totalRevenue = revenueAggregation[0]?.total || 0;
    
    // 5. Recent Activity (Latest 5 orders)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
      
    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalProducts,
        totalUsers,
        totalOrders,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

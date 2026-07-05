import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  image: z.string().min(1, 'Image is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
    addressLine: z.string().min(1, 'Address line is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
  }),
});

// GET: Retrieve logged-in user's orders (or a single order by orderId query param)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const order = await Order.findOne({ _id: orderId, user: tokenUser.userId });
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    const orders = await Order.find({ user: tokenUser.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    console.error('Fetch Orders API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// POST: Create a new order (Checkout)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to purchase.' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { items, shippingAddress } = parsed.data;
    
    // Inventory Verification & Deduction Loop
    let computedTotal = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product "${item.name}" no longer exists in our catalog.` },
          { status: 404 }
        );
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for "${product.name}". Only ${product.stock} items left.` },
          { status: 400 }
        );
      }
      
      // Update inventory stock levels
      product.stock -= item.quantity;
      await product.save();
      
      computedTotal += product.price * item.quantity;
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      });
    }
    
    const newOrder = await Order.create({
      user: tokenUser.userId,
      items: validatedItems,
      totalAmount: computedTotal,
      shippingAddress,
      status: 'Pending',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      orderId: newOrder._id.toString(),
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Order API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

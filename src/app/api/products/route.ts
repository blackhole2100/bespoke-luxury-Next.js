import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  category: z.string().min(1, 'Category is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  originalPrice: z.coerce.number().nullable().optional(),
  image: z.string().min(1, 'Image link or path is required.'),
  description: z.string().min(1, 'Description is required.'),
  isNew: z.boolean().optional(),
  badge: z.string().nullable().optional(),
  stock: z.coerce.number().min(0).optional(),
});

// GET: Fetch all products with search and category filters
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const badge = searchParams.get('badge');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    if (badge && badge.toLowerCase() !== 'all') {
      query.badge = badge.toLowerCase();
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error('Fetch Products API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// POST: Add a new product (Admin Only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Check admin credentials
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser || tokenUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const productData = parsed.data;
    const newProduct = await Product.create({
      ...productData,
      isNew: productData.badge === 'new' || productData.isNew || false,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Product added successfully!',
      product: newProduct,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

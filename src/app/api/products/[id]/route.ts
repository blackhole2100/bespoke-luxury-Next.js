import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  originalPrice: z.coerce.number().nullable().optional(),
  image: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  isNew: z.boolean().optional(),
  badge: z.string().nullable().optional(),
  stock: z.coerce.number().min(0).optional(),
}).partial();

// GET: Fetch details of a single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('Fetch Single Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// PUT: Update product details (Admin Only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser || tokenUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }
    
    const updateData = parsed.data;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Update Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product (Admin Only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser || tokenUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }
    
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error: any) {
    console.error('Delete Product API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

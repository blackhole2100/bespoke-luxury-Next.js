import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID.' }, { status: 400 });
    }

    const body = await req.json();
    const { userName, userEmail, rating, comment } = body;

    if (!userName || !userEmail || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'All review fields are required.' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    // Push new review
    product.reviews.push({ userName, userEmail, rating: Number(rating), comment });

    // Recalculate average rating
    const totalRatings = product.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0);
    product.ratings.average = parseFloat((totalRatings / product.reviews.length).toFixed(1));
    product.ratings.count = product.reviews.length;

    await product.save();

    return NextResponse.json({
      success: true,
      ratings: product.ratings,
      review: product.reviews[product.reviews.length - 1],
    }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/products/[id]/reviews]', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID.' }, { status: 400 });
    }

    const product = await Product.findById(id).select('reviews ratings').lean();
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reviews: product.reviews, ratings: product.ratings });
  } catch (err) {
    console.error('[GET /api/products/[id]/reviews]', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

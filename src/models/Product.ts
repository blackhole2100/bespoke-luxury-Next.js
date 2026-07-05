import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    userName:  { type: String, required: true },
    userEmail: { type: String, required: true },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    comment:   { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    name:          { type: String, required: true },
    category:      { type: String, required: true, index: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    image:         { type: String, required: true },
    description:   { type: String, required: true },
    isNew:         { type: Boolean, default: false },
    badge:         { type: String, enum: ['new', 'sale', null], default: null, index: true },
    stock:         { type: Number, default: 20 },
    ratings: {
      average: { type: Number, default: 5 },
      count:   { type: Number, default: 1 },
    },
    reviews: { type: [ReviewSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

import dbConnect from '../src/lib/dbConnect';
import Product from '../src/models/Product';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

const SEED_PRODUCTS = [
  {
    name: 'Grey Fabric Sofa',
    category: 'sofa',
    price: 65000,
    originalPrice: null,
    image: '/images/p1.png',
    description: 'Modern and cozy fabric sofa for stylish living rooms.',
    isNew: true,
    badge: 'new',
    stock: 12,
    ratings: { average: 5, count: 128 }
  },
  {
    name: 'Royal Blue Velvet Armchair',
    category: 'chair',
    price: 42000,
    originalPrice: null,
    image: '/images/p2.png',
    description: 'Luxurious velvet armchair that adds elegance to any space.',
    isNew: false,
    badge: null,
    stock: 8,
    ratings: { average: 5, count: 94 }
  },
  {
    name: 'Premium Brown Leather Loveseat',
    category: 'sofa',
    price: 78000,
    originalPrice: null,
    image: '/images/p3.png',
    description: 'Elegant leather loveseat for a classic, timeless touch.',
    isNew: false,
    badge: null,
    stock: 6,
    ratings: { average: 4.5, count: 73 }
  },
  {
    name: 'Gold Accent Lounge Chair',
    category: 'chair',
    price: 50000,
    originalPrice: null,
    image: '/images/p4.png',
    description: 'Stylish gold-accented chair for a luxurious interior.',
    isNew: true,
    badge: 'new',
    stock: 15,
    ratings: { average: 5, count: 112 }
  },
  {
    name: 'Silver Metallic Armchair',
    category: 'chair',
    price: 48000,
    originalPrice: null,
    image: '/images/p5.png',
    description: 'Modern sleek silver chair to elevate your decor.',
    isNew: false,
    badge: null,
    stock: 10,
    ratings: { average: 4.5, count: 87 }
  },
  {
    name: 'Luxury White Sectional Sofa',
    category: 'sofa',
    price: 95000,
    originalPrice: null,
    image: '/images/p6.png',
    description: 'Spacious and elegant white sofa for ultimate comfort.',
    isNew: false,
    badge: null,
    stock: 5,
    ratings: { average: 5, count: 201 }
  },
  {
    name: 'Beautiful White Sofa with Pillow',
    category: 'sofa',
    price: 40000,
    originalPrice: 80000,
    image: '/images/p9.png',
    description: 'Elegant white sofa with soft pillows for extra relaxation.',
    isNew: false,
    badge: 'sale',
    stock: 14,
    ratings: { average: 5, count: 155 }
  },
  {
    name: 'Special Wooden Shoe Case',
    category: 'other',
    price: 15000,
    originalPrice: 30000,
    image: '/images/p10.png',
    description: 'Stylish wooden shoe rack to keep footwear organized.',
    isNew: false,
    badge: 'sale',
    stock: 22,
    ratings: { average: 4.5, count: 62 }
  },
  {
    name: 'Circular Wooden Chair with Pillow',
    category: 'chair',
    price: 22500,
    originalPrice: 45000,
    image: '/images/p11.png',
    description: 'Unique circular wooden chair with a comfortable pillow.',
    isNew: false,
    badge: 'sale',
    stock: 9,
    ratings: { average: 5, count: 89 }
  },
  {
    name: 'Contemporary Yellow Accent Chair',
    category: 'chair',
    price: 41000,
    originalPrice: null,
    image: '/images/p8.png',
    description: 'Bright modern yellow chair for a pop of colour.',
    isNew: true,
    badge: 'new',
    stock: 7,
    ratings: { average: 5, count: 103 }
  },
  {
    name: 'Plush Purple Lounge Chair',
    category: 'chair',
    price: 19000,
    originalPrice: 38000,
    image: '/images/p7.png',
    description: 'Elegant stylish purple lounge chair, perfect for relaxation.',
    isNew: false,
    badge: 'sale',
    stock: 11,
    ratings: { average: 4.5, count: 76 }
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    // Ensure MONGODB_URI is set for scripting or fallback
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/royal-furniture';
    await dbConnect();
    
    // 1. Seed Products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log(`Seeding ${SEED_PRODUCTS.length} products...`);
    await Product.insertMany(SEED_PRODUCTS);
    console.log('Products seeded successfully.');
    
    // 2. Seed Admin User
    const adminEmail = 'admin@royalfurniture.com';
    console.log(`Checking for admin user: ${adminEmail}...`);
    await User.deleteMany({ email: adminEmail });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create({
      name: 'Royal Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    
    console.log(`Admin account [${adminEmail}] seeded successfully.`);
    console.log('Database seeding process completed.');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seed();

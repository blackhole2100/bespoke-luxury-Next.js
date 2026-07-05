import dbConnect from '../src/lib/dbConnect';
import Product from '../src/models/Product';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

const SEED_PRODUCTS = [
  {
    name: 'Aurelia Luxe Curved Bouclé Sofa',
    category: 'sofa',
    price: 185000,
    originalPrice: null,
    image: '/images/p1.png',
    description: 'A masterpiece of curved modern design, upholstered in premium Belgian textured bouclé fabric with a high-density down-fill core.',
    isNew: true,
    badge: 'new',
    stock: 8,
    ratings: { average: 4.9, count: 128 }
  },
  {
    name: 'Marceau Sapphire Velvet Lounge Chair',
    category: 'chair',
    price: 58000,
    originalPrice: null,
    image: '/images/p2.png',
    description: 'A mid-century modern statement armchair wrapped in Italian sapphire velvet, framed by hand-finished American Walnut accents.',
    isNew: false,
    badge: null,
    stock: 12,
    ratings: { average: 4.8, count: 94 }
  },
  {
    name: 'Venezia Chestnut Aniline Leather Loveseat',
    category: 'sofa',
    price: 245000,
    originalPrice: null,
    image: '/images/p3.png',
    description: 'Upholstered in full-grain, oil-waxed Tuscan aniline leather that develops a rich, unique patina over years of use.',
    isNew: false,
    badge: null,
    stock: 5,
    ratings: { average: 4.9, count: 73 }
  },
  {
    name: 'D’Or Brass Minimalist Lounge Chair',
    category: 'chair',
    price: 85000,
    originalPrice: null,
    image: '/images/p4.png',
    description: 'A striking accent chair featuring brushed-gold brass structural framing and thick, high-density cotton canvas cushions.',
    isNew: true,
    badge: 'new',
    stock: 10,
    ratings: { average: 5.0, count: 112 }
  },
  {
    name: 'Verona Chrome-Plated Club Chair',
    category: 'chair',
    price: 72000,
    originalPrice: null,
    image: '/images/p5.png',
    description: 'An industrial luxury club chair utilizing bent steel chrome pipes and premium black matte grain leather cushioning.',
    isNew: false,
    badge: null,
    stock: 6,
    ratings: { average: 4.7, count: 87 }
  },
  {
    name: 'Seraphina Modular Linen Sectional',
    category: 'sofa',
    price: 320000,
    originalPrice: null,
    image: '/images/p6.png',
    description: 'Deep-seated modular lounge configuration upholstered in stain-resistant heavy linen, customizable to fit any architectural layout.',
    isNew: false,
    badge: null,
    stock: 4,
    ratings: { average: 4.9, count: 201 }
  },
  {
    name: 'Monceau Luxe Linen Sofa with Pillows',
    category: 'sofa',
    price: 115000,
    originalPrice: 230000,
    image: '/images/p9.png',
    description: 'An elegant chalk-white slipcovered sofa in premium linen-blend, featuring down-blend cushions for deep, relaxed comfort.',
    isNew: false,
    badge: 'sale',
    stock: 14,
    ratings: { average: 4.8, count: 155 }
  },
  {
    name: 'Toscana Walnut Entryway Credenza',
    category: 'other',
    price: 95000,
    originalPrice: 190000,
    image: '/images/p10.png',
    description: 'Artisanal sideboard crafted from solid American black walnut. Features soft-close sliding doors and adjustable internal shelving.',
    isNew: false,
    badge: 'sale',
    stock: 15,
    ratings: { average: 4.9, count: 62 }
  },
  {
    name: 'Sienna Curved Oak Accent Chair',
    category: 'chair',
    price: 45000,
    originalPrice: 90000,
    image: '/images/p11.png',
    description: 'Hand-shaped solid white oak armchair with a sculpted circular seat and a premium organic wool boucle accent cushion.',
    isNew: false,
    badge: 'sale',
    stock: 9,
    ratings: { average: 5.0, count: 89 }
  },
  {
    name: 'Saffron Velvet Occasional Lounge Chair',
    category: 'chair',
    price: 68000,
    originalPrice: null,
    image: '/images/p8.png',
    description: 'Bring warm elegance to your studio with this occasional chair upholstered in high-durability saffron-yellow velvet.',
    isNew: true,
    badge: 'new',
    stock: 7,
    ratings: { average: 4.8, count: 103 }
  },
  {
    name: 'Amiens Plum Velvet Wingback Chair',
    category: 'chair',
    price: 39000,
    originalPrice: 78000,
    image: '/images/p7.png',
    description: 'A tall-back statement reading chair upholstered in rich plum-colored velvet, featuring turned ash wood front legs.',
    isNew: false,
    badge: 'sale',
    stock: 11,
    ratings: { average: 4.6, count: 76 }
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/royal-furniture';
    await dbConnect();
    
    // Seed Products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log(`Seeding ${SEED_PRODUCTS.length} premium products...`);
    await Product.insertMany(SEED_PRODUCTS);
    console.log('Premium products seeded successfully.');
    
    // Seed Admin User
    const adminEmail = 'admin@royalfurniture.com';
    console.log(`Checking for admin user: ${adminEmail}...`);
    await User.deleteMany({ email: adminEmail });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create({
      name: 'Arthur Rousseau',
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

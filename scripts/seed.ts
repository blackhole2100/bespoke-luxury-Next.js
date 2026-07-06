import { loadEnvConfig } from '@next/env';

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
    description: 'A luxury reproduction of mid-century chrome framing featuring hand-tufted tan premium leather wraps.',
    isNew: false,
    badge: null,
    stock: 7,
    ratings: { average: 4.7, count: 68 }
  },
  {
    name: 'Seraphina Modular Linen Sectional',
    category: 'sofa',
    price: 320000,
    originalPrice: null,
    image: '/images/p6.png',
    description: 'A massive, modular, deep-seated sectional sofa upholstered in stain-resistant heavy Belgian flax linen.',
    isNew: false,
    badge: null,
    stock: 4,
    ratings: { average: 4.8, count: 145 }
  },
  {
    name: 'Monceau Slipcover Sofa',
    category: 'sofa',
    price: 165000,
    originalPrice: 195000,
    image: '/images/p9.png',
    description: 'An elegant slipcover sofa designed for comfort, featuring a washable high-density cotton cover and feather-filled cushions.',
    isNew: false,
    badge: 'sale',
    stock: 10,
    ratings: { average: 4.7, count: 98 }
  },
  {
    name: 'Ophelia Curved Bouclé Sofa',
    category: 'sofa',
    price: 215000,
    originalPrice: null,
    image: '/images/p10.png',
    description: 'An artful organic sofa offering fluid lines and premium textured ivory bouclé, standing on solid oak cylindrical legs.',
    isNew: true,
    badge: 'new',
    stock: 6,
    ratings: { average: 4.9, count: 84 }
  },
  {
    name: 'Grasse Organic Oak Accent Chair',
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
    console.log('Loading environment configurations...');
    await loadEnvConfig(process.cwd());

    console.log('Connecting to database...');
    // Dynamically import Mongoose database dependencies after environment variables are loaded
    const dbConnect = (await import('../src/lib/dbConnect')).default;
    const Product = (await import('../src/models/Product')).default;
    const User = (await import('../src/models/User')).default;
    const bcrypt = (await import('bcryptjs')).default;

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

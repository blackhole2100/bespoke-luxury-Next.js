import { MetadataRoute } from 'next';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://elegant-furniture-hub.vercel.app';
  
  // Static routes
  const staticRoutes = [
    '',
    '/product',
    '/faq',
    '/shipping',
    '/returns',
    '/warranty',
    '/terms',
    '/privacy',
    '/signup',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const products = await ProductModel.find({}, '_id updatedAt');
    productRoutes = products.map(product => ({
      url: `${baseUrl}/product/${product._id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
  }
  
  return [...staticRoutes, ...productRoutes];
}

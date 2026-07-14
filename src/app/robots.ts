import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/success'],
    },
    sitemap: 'https://elegant-furniture-hub.vercel.app/sitemap.xml',
  };
}

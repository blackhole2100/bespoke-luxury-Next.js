import { Metadata } from 'next';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    await dbConnect();
    const product = await ProductModel.findById(id);
    if (product) {
      return {
        title: `${product.name} | Custom Crafted | Elegant Furniture Hub`,
        description: `${product.description.slice(0, 155)}... Purchase the bespoke, handcrafted ${product.name} at Elegant Furniture Hub.`,
        openGraph: {
          title: `${product.name} | Elegant Furniture Hub`,
          description: product.description,
          images: [{ url: product.image }],
        },
      };
    }
  } catch (error) {
    console.error('Failed to generate product metadata:', error);
  }

  return {
    title: 'Bespoke Luxury Furniture | Elegant Furniture Hub',
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const { id } = await params;
  let jsonLd = null;

  try {
    await dbConnect();
    const product = await ProductModel.findById(id);
    if (product) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": `https://elegant-furniture-hub.vercel.app${product.image}`,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": "Elegant Furniture Hub"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://elegant-furniture-hub.vercel.app/product/${product._id}`,
          "priceCurrency": "INR",
          "price": product.price,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      };
    }
  } catch (error) {
    console.error('Failed to fetch product for JSON-LD:', error);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}

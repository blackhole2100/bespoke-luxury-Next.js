import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elegant Furniture Hub | Handcrafted Luxury Living & Bespoke Furniture",
  description: "Welcome to Elegant Furniture Hub. Explore our exclusive, curated collection of artisanal, handcrafted sofas, lounge chairs, dining tables, and luxury home decor designed for the discerning home.",
  keywords: "elegant furniture hub, luxury furniture, bespoke sofas, handcrafted dining tables, premium armchairs, SoHo furniture shop",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap" 
          rel="stylesheet" 
        />

        {/* Bootstrap */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />

        {/* Icons */}
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FurnitureStore",
              "name": "Elegant Furniture Hub",
              "url": "https://elegant-furniture-hub.vercel.app",
              "logo": "https://elegant-furniture-hub.vercel.app/images/logo1.png",
              "description": "Elegant Furniture Hub — Luxury handcrafted furniture for the modern home. Explore our exclusive collection of sofas, chairs, and bespoke pieces.",
              "telephone": "+1-212-555-8934",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "452 West Broadway",
                "addressLocality": "SoHo, NY",
                "postalCode": "10012",
                "addressCountry": "US"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "10:00",
                  "closes": "19:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/elegantfurniturehub",
                "https://twitter.com/elegantfurniture"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}

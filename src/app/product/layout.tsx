import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Bespoke Luxury Furniture Collection | Elegant Furniture Hub",
  description: "Browse our full collection of premium handcrafted sofas, velvet armchairs, solid oak tables, and luxury seating. Order custom configurations built to last a lifetime.",
};

export default function ProductCatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Console - Order History | Elegant Furniture Hub",
  description: "Access your Elegant Furniture Hub client console to track custom fabrication milestones, review specifications, and download purchase receipts.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

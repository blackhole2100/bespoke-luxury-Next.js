import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout & Order Confirmation | Elegant Furniture Hub",
  description: "Securely review purchase orders and manage custom fabrication milestones at Elegant Furniture Hub.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

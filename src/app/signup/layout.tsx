import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Registration & Sign In | Elegant Furniture Hub",
  description: "Sign in or register an account at Elegant Furniture Hub to save configurations, track your orders, and view past purchases.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

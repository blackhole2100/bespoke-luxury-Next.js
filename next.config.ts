import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://admin.elegant-furniture-hub.vercel.app/',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: 'https://admin.elegant-furniture-hub.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Add this line to allow Unsplash images
  },
};

export default nextConfig;

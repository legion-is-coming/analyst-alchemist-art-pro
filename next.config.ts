import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true
  // no rewrites needed; frontend calls /api/auth/* directly
};

export default nextConfig;

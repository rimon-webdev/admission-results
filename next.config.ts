import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // build চলার সময় ESLint warnings/errors ignore করবে
  },
};

export default nextConfig;

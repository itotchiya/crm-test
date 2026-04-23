import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Prevent stale build cache issues on Vercel with route groups
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure the base path if your repository name is not the domain
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/',
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Exclude mcp-server directory from Next.js build
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@modelcontextprotocol/sdk/server/mcp.js': 'commonjs @modelcontextprotocol/sdk/server/mcp.js',
        '@modelcontextprotocol/sdk/server/streamableHttp.js': 'commonjs @modelcontextprotocol/sdk/server/streamableHttp.js',
      });
    }
    
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Ignore mcp-server directory completely
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/mcp-server/**', '**/node_modules/**'],
    };
    
    return config;
  },
  // Exclude mcp-server from being processed
  transpilePackages: [],
};

export default nextConfig;

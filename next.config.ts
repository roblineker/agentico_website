import type { NextConfig } from "next";

// Security headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://elevenlabs.io https://*.elevenlabs.io https://js.hcaptcha.com https://*.hcaptcha.com; style-src 'self' 'unsafe-inline' https://*.hcaptcha.com; img-src 'self' data: https: http: blob:; font-src 'self' data:; connect-src 'self' https://www.agentico.com.au https://*.elevenlabs.io wss://*.elevenlabs.io https://*.hcaptcha.com; frame-src https://*.hcaptcha.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; media-src 'self' https: blob:;",
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
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

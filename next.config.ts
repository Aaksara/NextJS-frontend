import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const isDev = process.env.NODE_ENV !== 'production';

// Next.js injects inline bootstrap scripts, hence 'unsafe-inline'.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${apiUrl}`,
  `connect-src 'self' ${apiUrl} ${apiUrl.replace(/^http/, 'ws')}`,
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

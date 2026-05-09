/** @type {import('next').NextConfig} */
import { createRequire } from "module";

// Check if element-tagger is available
function isElementTaggerAvailable() {
  try {
    const require = createRequire(import.meta.url);
    require.resolve("@softgenai/element-tagger");
    return true;
  } catch {
    return false;
  }
}

// Build turbo rules only if tagger is available
function getTurboRules() {
  if (!isElementTaggerAvailable()) {
    console.log(
      "[Softgen] Element tagger not found, skipping loader configuration"
    );
    return {};
  }

  return {
    "*.tsx": ["@softgenai/element-tagger"],
    "*.jsx": ["@softgenai/element-tagger"],
  };
}

const nextConfig = {
  reactStrictMode: true,
  // Use standalone output for Docker deployments
  // Set to undefined for Vercel deployments
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  eslint: {
    // Ignore ESLint errors during build (temporary fix for deployment)
    ignoreDuringBuilds: true,
  },
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SOFTGEN_SCRIPT_URL: process.env.NEXT_PUBLIC_SOFTGEN_SCRIPT_URL,
    NEXT_PUBLIC_SOFTGEN_EDITOR_URL: process.env.NEXT_PUBLIC_SOFTGEN_EDITOR_URL,
    NEXT_PUBLIC_ASSETS_URL: process.env.NEXT_PUBLIC_ASSETS_URL,
  },
  experimental: {
    turbo: {
      rules: getTurboRules(),
    },
  },
  images: {
    unoptimized: true,
    domains: [
      'fight-flight-studio.vercel.app',
      'fightandflight.in',
      'www.fightandflight.in',
      'images.unsplash.com',
      'cdn.softgen.ai',
      'cdn.softgen.dev',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  basePath: '',
  trailingSlash: false,
  allowedDevOrigins: ["*.daytona.work", "*.softgen.dev"],
  
  // URL Masking: Rewrites to hide internal structure
  async rewrites() {
    return [
      // ==========================================
      // STATIC FILES: Serve uploads folder
      // ==========================================
      {
        source: '/uploads/:path*',
        destination: '/api/serve-upload/:path*',
      },
      
      // ==========================================
      // ROUTE HASHING: Hide page names with hash codes
      // ==========================================
      // User/Member Routes (hash codes instead of readable names)
      {
        source: '/app/d7f8a',
        destination: '/app',
      },
      {
        source: '/app/b3c9e',
        destination: '/app/schedule',
      },
      {
        source: '/app/f2a1d',
        destination: '/app/bookings',
      },
      {
        source: '/app/e9c4b',
        destination: '/app/credits',
      },
      {
        source: '/app/a8f3d',
        destination: '/app/hero',
      },
      {
        source: '/app/c5b2e',
        destination: '/app/forms',
      },
      {
        source: '/app/9d6f1',
        destination: '/app/profile',
      },
      
      // Admin Routes (hash codes)
      {
        source: '/admin/x9a7b',
        destination: '/admin',
      },
      {
        source: '/admin/y4c8d',
        destination: '/admin/sessions',
      },
      {
        source: '/admin/z2e6f',
        destination: '/admin/credits',
      },
      {
        source: '/admin/w1f5g',
        destination: '/admin/expiry',
      },
      {
        source: '/admin/v3d9h',
        destination: '/admin/classes',
      },
      
      // ==========================================
      // API ENDPOINT MASKING
      // ==========================================
      // Mask API endpoints - make them look like regular pages
      {
        source: '/account/stats',
        destination: '/api/user/stats',
      },
      {
        source: '/account/profile-data',
        destination: '/api/user/profile',
      },
      {
        source: '/account/hero-data',
        destination: '/api/user/hero',
      },
      {
        source: '/account/activity',
        destination: '/api/user/activity',
      },
      {
        source: '/secure/bookings',
        destination: '/api/bookings',
      },
      {
        source: '/secure/forms',
        destination: '/api/forms/submissions',
      },
      {
        source: '/secure/payments',
        destination: '/api/payments/create-order',
      },
      {
        source: '/secure/verify-payment',
        destination: '/api/payments/verify',
      },
      {
        source: '/admin-portal/analytics-data',
        destination: '/api/admin/analytics',
      },
      {
        source: '/admin-portal/classes-data',
        destination: '/api/admin/classes',
      },
      {
        source: '/admin-portal/users-data',
        destination: '/api/admin/users',
      },
      {
        source: '/admin-portal/credits-adjust',
        destination: '/api/admin/credits/adjust',
      },
      {
        source: '/auth/signin-endpoint',
        destination: '/api/auth/signin',
      },
      {
        source: '/auth/signup-endpoint',
        destination: '/api/auth/signup',
      },
      {
        source: '/auth/verify-admin-endpoint',
        destination: '/api/auth/verify-admin',
      },
    ];
  },
  
  // Security headers to prevent iframe embedding (anti-clickjacking)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Allows framing only from same origin
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

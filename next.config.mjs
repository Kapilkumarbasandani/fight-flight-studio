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
  output: (process.env.DOCKER_BUILD === 'true' || process.env.AWS_AMPLIFY === 'true') ? 'standalone' : undefined,
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
};

export default nextConfig;

/**
 * Route Hashing Configuration
 * 
 * Maps user-facing hash codes to actual internal routes.
 * This hides the application structure from users.
 */

// Hash code to route mapping
export const ROUTE_HASH_MAP: Record<string, string> = {
  // Member/User Routes
  'd7f8a': '/app',                    // Dashboard
  'b3c9e': '/app/schedule',           // Schedule
  'f2a1d': '/app/bookings',           // My Bookings
  'e9c4b': '/app/credits',            // Credits
  'a8f3d': '/app/hero',               // Hero Stats
  'c5b2e': '/app/forms',              // Forms & Waivers
  '9d6f1': '/app/profile',            // Profile
  
  // Admin Routes
  'x9a7b': '/admin',                  // Admin Dashboard
  'y4c8d': '/admin/sessions',         // Manage Sessions
  'z2e6f': '/admin/credits',          // Credit Adjustments
  'w1f5g': '/admin/expiry',           // Expiry Management
  'v3d9h': '/admin/classes',          // Classes Management
};

// Reverse mapping: route to hash
export const ROUTE_TO_HASH: Record<string, string> = Object.entries(ROUTE_HASH_MAP).reduce(
  (acc, [hash, route]) => {
    acc[route] = hash;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Get hashed URL for a given route
 * @param route - Original route path (e.g., '/app/schedule')
 * @returns Hashed URL (e.g., '/app/b3c9e')
 */
export function getHashedRoute(route: string): string {
  const hash = ROUTE_TO_HASH[route];
  
  if (!hash) {
    console.warn(`No hash found for route: ${route}`);
    return route; // Fallback to original route
  }
  
  // For app routes, return /app/{hash}
  if (route.startsWith('/app/') || route === '/app') {
    return route === '/app' ? `/app/${hash}` : `/app/${hash}`;
  }
  
  // For admin routes, return /admin/{hash}
  if (route.startsWith('/admin/') || route === '/admin') {
    return route === '/admin' ? `/admin/${hash}` : `/admin/${hash}`;
  }
  
  return route;
}

/**
 * Get original route from hash code
 * @param hash - Hash code (e.g., 'b3c9e')
 * @returns Original route path (e.g., '/app/schedule')
 */
export function getRouteFromHash(hash: string): string | undefined {
  return ROUTE_HASH_MAP[hash];
}

/**
 * Check if a path is a hashed route
 * @param path - URL path
 * @returns true if path uses hash codes
 */
export function isHashedRoute(path: string): boolean {
  const hashPattern = /\/(app|admin)\/([a-z0-9]{5})$/;
  return hashPattern.test(path);
}

/**
 * Extract hash code from a URL path
 * @param path - URL path (e.g., '/app/b3c9e')
 * @returns Hash code (e.g., 'b3c9e') or null
 */
export function extractHashFromPath(path: string): string | null {
  const match = path.match(/\/(app|admin)\/([a-z0-9]{5})$/);
  return match ? match[2] : null;
}

/**
 * Generate a random 5-character hash code
 * Useful for creating new route hashes
 */
export function generateHashCode(): string {
  const chars = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < 5; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export default {
  ROUTE_HASH_MAP,
  ROUTE_TO_HASH,
  getHashedRoute,
  getRouteFromHash,
  isHashedRoute,
  extractHashFromPath,
  generateHashCode,
};

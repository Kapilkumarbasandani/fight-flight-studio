/**
 * Centralized API Configuration with URL Masking
 * 
 * All API endpoints are masked to hide internal structure.
 * This provides security through obscurity and cleaner URLs.
 */

// Base URL for API calls
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

/**
 * Masked API Endpoints
 * External-facing URLs that hide internal API structure
 */
export const API_ENDPOINTS = {
  // User Account endpoints (masked as /account/*)
  USER: {
    STATS: '/account/stats',
    PROFILE: '/account/profile-data',
    HERO: '/account/hero-data',
    ACTIVITY: '/account/activity',
  },
  
  // Secure endpoints (masked as /secure/*)
  SECURE: {
    BOOKINGS: '/secure/bookings',
    FORMS: '/secure/forms',
    PAYMENTS: '/secure/payments',
    VERIFY_PAYMENT: '/secure/verify-payment',
  },
  
  // Admin portal endpoints (masked as /admin-portal/*)
  ADMIN: {
    ANALYTICS: '/admin-portal/analytics-data',
    CLASSES: '/admin-portal/classes-data',
    USERS: '/admin-portal/users-data',
    CREDITS_ADJUST: '/admin-portal/credits-adjust',
  },
  
  // Auth endpoints (masked as /auth/*)
  AUTH: {
    SIGNIN: '/auth/signin-endpoint',
    SIGNUP: '/auth/signup-endpoint',
    VERIFY_ADMIN: '/auth/verify-admin-endpoint',
  },
};

/**
 * Legacy API Endpoints (for backward compatibility)
 * These still work but are not recommended for new code
 */
export const LEGACY_ENDPOINTS = {
  USER_STATS: '/api/user/stats',
  USER_PROFILE: '/api/user/profile',
  USER_HERO: '/api/user/hero',
  USER_ACTIVITY: '/api/user/activity',
  BOOKINGS: '/api/bookings',
  FORMS: '/api/forms/submissions',
  PAYMENTS: '/api/payments/create-order',
  VERIFY_PAYMENT: '/api/payments/verify',
  ADMIN_ANALYTICS: '/api/admin/analytics',
  ADMIN_CLASSES: '/api/admin/classes',
  ADMIN_USERS: '/api/admin/users',
  CREDITS_ADJUST: '/api/admin/credits/adjust',
  AUTH_SIGNIN: '/api/auth/signin',
  AUTH_SIGNUP: '/api/auth/signup',
  VERIFY_ADMIN: '/api/auth/verify-admin',
};

/**
 * Build full URL with query parameters
 * @param endpoint - API endpoint
 * @param params - Query parameters
 */
export function buildAPIUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, BASE_URL || window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Fetch wrapper with masked URLs
 * @param endpoint - API endpoint from API_ENDPOINTS
 * @param options - Fetch options
 */
export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

export default API_ENDPOINTS;

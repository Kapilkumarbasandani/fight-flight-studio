# URL Masking Documentation

## Overview
This application implements comprehensive URL masking to hide internal API structure and enhance security through obscurity.

## What is URL Masking?

URL masking hides the actual backend API routes by rewriting URLs to appear as regular pages or generic endpoints. This provides:

1. **Security through obscurity** - Attackers can't easily map your API structure
2. **Cleaner URLs** - `/account/profile-data` instead of `/api/user/profile`
3. **Professional appearance** - URLs look like pages, not API endpoints
4. **Flexibility** - Change backend structure without breaking frontend

## Implementation

### 1. Next.js Rewrites (next.config.mjs)

URL rewrites happen at the server level before requests reach your API:

```javascript
// Client sees: /account/stats?userId=123
// Server routes to: /api/user/stats?userId=123

{
  source: '/account/stats',
  destination: '/api/user/stats',
}
```

### 2. Masked Endpoints

| Category | Masked URL | Internal API Route |
|----------|-----------|-------------------|
| **User Account** |
| Stats | `/account/stats` | `/api/user/stats` |
| Profile | `/account/profile-data` | `/api/user/profile` |
| Hero | `/account/hero-data` | `/api/user/hero` |
| Activity | `/account/activity` | `/api/user/activity` |
| **Secure Operations** |
| Bookings | `/secure/bookings` | `/api/bookings` |
| Forms | `/secure/forms` | `/api/forms/submissions` |
| Payments | `/secure/payments` | `/api/payments/create-order` |
| Verify Payment | `/secure/verify-payment` | `/api/payments/verify` |
| **Admin Portal** |
| Analytics | `/admin-portal/analytics-data` | `/api/admin/analytics` |
| Classes | `/admin-portal/classes-data` | `/api/admin/classes` |
| Users | `/admin-portal/users-data` | `/api/admin/users` |
| Credits | `/admin-portal/credits-adjust` | `/api/admin/credits/adjust` |
| **Authentication** |
| Sign In | `/auth/signin-endpoint` | `/api/auth/signin` |
| Sign Up | `/auth/signup-endpoint` | `/api/auth/signup` |
| Verify Admin | `/auth/verify-admin-endpoint` | `/api/auth/verify-admin` |

## Usage

### Option 1: Use Masked URLs (Recommended)

```typescript
import { API_ENDPOINTS, buildAPIUrl } from '@/lib/api-config';

// Fetch user stats with masked URL
const url = buildAPIUrl(API_ENDPOINTS.USER.STATS, { userId });
const response = await fetch(url);
```

### Option 2: Legacy URLs (Still works)

```typescript
// Old way - still functional but not recommended
const response = await fetch(`/api/user/stats?userId=${userId}`);
```

**Both approaches work!** The rewrite rules ensure backward compatibility.

## Security Headers

In addition to URL masking, the following security headers are applied:

```javascript
X-Frame-Options: SAMEORIGIN           // Prevent clickjacking
X-Content-Type-Options: nosniff       // Prevent MIME sniffing
X-XSS-Protection: 1; mode=block       // XSS protection
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Migration Guide

### Updating Existing Code

To migrate from legacy API calls to masked URLs:

**Before:**
```typescript
const response = await fetch(`/api/user/profile?userId=${userId}`);
```

**After:**
```typescript
import { API_ENDPOINTS, buildAPIUrl } from '@/lib/api-config';

const url = buildAPIUrl(API_ENDPOINTS.USER.PROFILE, { userId });
const response = await fetch(url);
```

### Benefits of Migration

1. ✅ URLs are masked in network tab
2. ✅ Easier to change API structure later
3. ✅ Centralized endpoint management
4. ✅ Type-safe endpoint references
5. ✅ Better security posture

## Testing URL Masking

### Test in Browser

1. Open Developer Tools (F12)
2. Go to Network tab
3. Navigate to any page (e.g., Dashboard)
4. Look at network requests

**Before masking:** `/api/user/stats?userId=123`  
**After masking:** `/account/stats?userId=123`

### Test with cURL

```bash
# Both URLs work identically:

# Masked URL
curl "http://localhost:3000/account/stats?userId=123"

# Legacy URL  
curl "http://localhost:3000/api/user/stats?userId=123"
```

## Advanced: Custom Domain Masking

For production deployments with custom domains:

### Method 1: Reverse Proxy (Recommended)

Use nginx/Apache to proxy requests:

```nginx
# nginx.conf
location /account/ {
    proxy_pass http://localhost:3000/api/user/;
    proxy_set_header Host $host;
}
```

### Method 2: DNS-Level Masking

Configure your DNS provider (GoDaddy, Cloudflare) to forward:
- Set up domain forwarding with masking enabled
- Point to your Next.js app
- All traffic appears to come from your custom domain

### Method 3: Vercel Custom Domains

1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. Vercel automatically handles SSL and routing
4. URL masking works out of the box

## Production Deployment

### Environment Variables

Ensure these are set in production:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Vercel/Netlify

URL rewrites and headers work automatically. No additional configuration needed.

### Docker/VPS

Make sure your reverse proxy (nginx/Apache) is configured:

```nginx
# Preserve client IP and original headers
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Troubleshooting

### Issue: Masked URLs return 404

**Cause:** Next.js not loading rewrites  
**Solution:** Restart dev server after modifying next.config.mjs

```bash
npm run dev
```

### Issue: URLs work locally but not in production

**Cause:** Build cache or missing config  
**Solution:** Clear build cache and rebuild

```bash
rm -rf .next
npm run build
```

### Issue: CORS errors with masked URLs

**Cause:** Missing CORS headers  
**Solution:** Add CORS middleware in API routes

```typescript
// In your API route
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
```

## Best Practices

1. ✅ **Always use masked URLs for new code**
2. ✅ **Keep API_ENDPOINTS object updated**
3. ✅ **Never expose MongoDB IDs in URLs (use UUIDs or tokens)**
4. ✅ **Log masked URLs in analytics, not internal APIs**
5. ✅ **Document any new masked endpoints**
6. ❌ **Don't hardcode API paths in components**
7. ❌ **Don't expose sensitive data in URL parameters**

## Security Considerations

### What URL Masking Does:
- ✅ Hides internal API structure
- ✅ Makes API discovery harder
- ✅ Looks more professional
- ✅ Provides basic obfuscation

### What URL Masking DOESN'T Do:
- ❌ Replace proper authentication
- ❌ Prevent API abuse
- ❌ Encrypt data in transit (use HTTPS)
- ❌ Validate user permissions

**Remember:** URL masking is just one layer. Always implement:
- Proper authentication (JWT/sessions)
- Authorization checks in API routes
- Rate limiting
- Input validation
- HTTPS in production

## Examples

### Complete Example: Fetching User Stats

```typescript
import { API_ENDPOINTS, buildAPIUrl, fetchAPI } from '@/lib/api-config';

async function getUserStats(userId: string) {
  try {
    // Method 1: Using buildAPIUrl helper
    const url = buildAPIUrl(API_ENDPOINTS.USER.STATS, { userId });
    const response = await fetch(url);
    const data = await response.json();
    
    // Method 2: Using fetchAPI wrapper (recommended)
    const stats = await fetchAPI(
      buildAPIUrl(API_ENDPOINTS.USER.STATS, { userId })
    );
    
    return stats;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
}
```

### POST Request Example

```typescript
import { API_ENDPOINTS } from '@/lib/api-config';

async function createBooking(bookingData: any) {
  const response = await fetch(API_ENDPOINTS.SECURE.BOOKINGS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  
  return response.json();
}
```

## Monitoring

Track URL masking effectiveness:

1. **Google Analytics:** All requests show masked URLs
2. **Error Logs:** Stack traces won't reveal API structure
3. **Network Tab:** Users see clean, professional URLs

## Summary

URL masking provides an additional security layer and professional appearance. Combined with proper authentication, rate limiting, and HTTPS, it creates a robust security posture for your application.

For questions or issues, consult the development team or open a GitHub issue.

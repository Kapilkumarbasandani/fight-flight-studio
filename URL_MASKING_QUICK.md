# URL Masking Quick Reference

## Current Status
✅ **URL masking is ACTIVE** - All API endpoints have masked alternatives

## Quick Comparison

### User Account Endpoints
```typescript
// ❌ Old (still works but visible in network tab)
fetch('/api/user/stats?userId=123')
fetch('/api/user/profile?userId=123')
fetch('/api/user/hero?userId=123')

// ✅ New (masked, recommended)
fetch('/account/stats?userId=123')
fetch('/account/profile-data?userId=123')
fetch('/account/hero-data?userId=123')
```

### Secure Endpoints
```typescript
// ❌ Old
fetch('/api/bookings')
fetch('/api/forms/submissions')
fetch('/api/payments/create-order')

// ✅ New (masked)
fetch('/secure/bookings')
fetch('/secure/forms')
fetch('/secure/payments')
```

### Admin Endpoints
```typescript
// ❌ Old
fetch('/api/admin/analytics')
fetch('/api/admin/classes')
fetch('/api/admin/users')

// ✅ New (masked)
fetch('/admin-portal/analytics-data')
fetch('/admin-portal/classes-data')
fetch('/admin-portal/users-data')
```

### Auth Endpoints
```typescript
// ❌ Old
fetch('/api/auth/signin')
fetch('/api/auth/signup')
fetch('/api/auth/verify-admin')

// ✅ New (masked)
fetch('/auth/signin-endpoint')
fetch('/auth/signup-endpoint')
fetch('/auth/verify-admin-endpoint')
```

## Testing

1. Start the server:
```bash
npm run dev
```

2. Open browser DevTools (F12) → Network tab

3. Login and navigate around

4. Check network requests - you'll see masked URLs!

## Both URLs Work!

You can use EITHER:
- **Masked URLs** (recommended) - `/account/stats`
- **Legacy URLs** (backward compatible) - `/api/user/stats`

The server automatically rewrites masked URLs to the correct API routes.

## Using the API Helper

```typescript
import { API_ENDPOINTS, buildAPIUrl } from '@/lib/api-config';

// Build masked URL with query params
const url = buildAPIUrl(API_ENDPOINTS.USER.STATS, { 
  userId: '123' 
});

// Result: /account/stats?userId=123
```

## Benefits

✅ Hide internal API structure from hackers  
✅ Professional-looking URLs  
✅ Easier to change backend without breaking frontend  
✅ Better security through obscurity  
✅ Clean network logs  

## Next Steps (Optional)

Want to migrate all API calls to masked URLs? Update fetch calls in:
- `src/pages/app/*.tsx` (user dashboard pages)
- `src/pages/admin/*.tsx` (admin pages)
- `src/components/*.tsx` (shared components)

See full documentation: [URL_MASKING.md](URL_MASKING.md)

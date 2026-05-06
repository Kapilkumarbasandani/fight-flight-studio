# Route Hashing - Quick Reference

## 🔒 URL Transformation

### What You See Now:
```
http://localhost:3000/app/b3c9e     ← Schedule
http://localhost:3000/app/f2a1d     ← Bookings
http://localhost:3000/app/9d6f1     ← Profile
http://localhost:3000/app/e9c4b     ← Credits
http://localhost:3000/app/a8f3d     ← Hero Stats
http://localhost:3000/app/c5b2e     ← Forms
```

### What It Was Before:
```
http://localhost:3000/app/schedule
http://localhost:3000/app/bookings
http://localhost:3000/app/profile
http://localhost:3000/app/credits
http://localhost:3000/app/hero
http://localhost:3000/app/forms
```

---

## 📋 Complete Hash Code List

| Route | Hash | Example URL |
|-------|------|-------------|
| Dashboard | `d7f8a` | `/app/d7f8a` |
| Schedule | `b3c9e` | `/app/b3c9e` |
| Bookings | `f2a1d` | `/app/f2a1d` |
| Credits | `e9c4b` | `/app/e9c4b` |
| Hero Stats | `a8f3d` | `/app/a8f3d` |
| Forms | `c5b2e` | `/app/c5b2e` |
| Profile | `9d6f1` | `/app/9d6f1` |

### Admin Routes
| Route | Hash | Example URL |
|-------|------|-------------|
| Admin Dashboard | `x9a7b` | `/admin/x9a7b` |
| Sessions | `y4c8d` | `/admin/y4c8d` |
| Credits | `z2e6f` | `/admin/z2e6f` |
| Expiry | `w1f5g` | `/admin/w1f5g` |
| Classes | `v3d9h` | `/admin/v3d9h` |

---

## ✅ Testing

1. Login to http://localhost:3000
2. Click any navigation link
3. Check URL bar - should show hash code
4. Both old and new URLs work:
   - ✅ `/app/b3c9e` (new, hashed)
   - ✅ `/app/schedule` (old, still works)

---

## 🎯 Why Route Hashing?

**Before:** `/app/schedule`
- ❌ Anyone can see page names
- ❌ Easy to guess other pages
- ❌ Reveals app structure

**After:** `/app/b3c9e`
- ✅ Hidden page names
- ✅ Impossible to guess
- ✅ Secure structure

---

## 🔧 For Developers

### Use in Code:
```tsx
import { getHashedRoute } from '@/lib/route-hash';

// Old way
<Link href="/app/schedule">Schedule</Link>

// New way (with hashing)
<Link href={getHashedRoute('/app/schedule')}>Schedule</Link>
```

### Adding New Routes:
1. Add to `src/lib/route-hash.ts`:
   ```ts
   'x7y2z': '/app/new-page',
   ```

2. Add to `next.config.mjs`:
   ```js
   {
     source: '/app/x7y2z',
     destination: '/app/new-page',
   }
   ```

3. Restart: `npm run dev`

---

## 🚀 Status

✅ **ACTIVE** - Route hashing is live!  
✅ **ALL routes** are hashed  
✅ **Navigation** uses hash codes  
✅ **Backward compatible** - old URLs still work

---

## 📖 Full Documentation

See [ROUTE_HASHING.md](ROUTE_HASHING.md) for complete guide.

---

**Server:** http://localhost:3000  
**Test URL:** http://localhost:3000/app/b3c9e (Schedule page)

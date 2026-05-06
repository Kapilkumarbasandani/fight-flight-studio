# Environment Variables Guide

## Overview
This document explains all environment variables used in the Fight & Flight Studio application. All URLs and sensitive configuration have been moved to environment variables for better security and flexibility.

---

## 📁 Configuration Files

### Development
- **`.env.local`** - Your local development environment variables (not committed to git)
- Copy from `.env.local.example` to get started

### Example/Template
- **`.env.local.example`** - Template with all available variables
- Safe to commit to git (no sensitive data)

### Production (Vercel)
- Set in Vercel Dashboard → Project → Settings → Environment Variables

---

## 🔐 Environment Variables Reference

### Database Configuration

#### `MONGODB_URI` (Required)
MongoDB connection string for your database.

**Local Development:**
```env
MONGODB_URI=mongodb://localhost:27017/fight-flight-studio
```

**Production (MongoDB Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fight-flight-studio?retryWrites=true&w=majority
```

**Your Production Value:**
```env
MONGODB_URI=mongodb+srv://kkbasandani74_db_user:A2FQMVaIulamBITh@cluster0.1tgizol.mongodb.net/fight-flight-studio?retryWrites=true&w=majority
```

---

### Application Configuration

#### `NEXT_PUBLIC_APP_URL` (Required)
The base URL where your application is hosted.

**Development:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_APP_URL=https://fightandflight.in
```

#### `NEXT_PUBLIC_SITE_NAME`
Your website name (used in SEO and metadata).

```env
NEXT_PUBLIC_SITE_NAME=Fight & Flight Studio
```

#### `NEXT_PUBLIC_SITE_DESCRIPTION`
Website description (used in SEO and metadata).

```env
NEXT_PUBLIC_SITE_DESCRIPTION=Bangalore's first and only Muay Thai and Aerial Dance Studio
```

---

### Third-Party CDN URLs

#### `NEXT_PUBLIC_SOFTGEN_SCRIPT_URL`
Softgen AI monitoring script (required for app functionality).

```env
NEXT_PUBLIC_SOFTGEN_SCRIPT_URL=https://cdn.softgen.ai/script.js
```

#### `NEXT_PUBLIC_SOFTGEN_EDITOR_URL`
Softgen Visual Editor (development only).

```env
NEXT_PUBLIC_SOFTGEN_EDITOR_URL=https://cdn.softgen.dev/visual-editor.min.js
```

---

### Image Hosting

#### `NEXT_PUBLIC_TESTIMONIAL_IMAGE_1`
First testimonial profile image URL.

```env
NEXT_PUBLIC_TESTIMONIAL_IMAGE_1=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop
```

#### `NEXT_PUBLIC_TESTIMONIAL_IMAGE_2`
Second testimonial profile image URL.

```env
NEXT_PUBLIC_TESTIMONIAL_IMAGE_2=https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop
```

#### `NEXT_PUBLIC_TESTIMONIAL_IMAGE_3`
Third testimonial profile image URL.

```env
NEXT_PUBLIC_TESTIMONIAL_IMAGE_3=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop
```

**Note:** You can replace these with your own image URLs or upload images to `/public` and use local paths like `/images/testimonial-1.jpg`

---

### Feature Flags

#### `NEXT_PUBLIC_ENABLE_PAYMENTS`
Enable/disable payment functionality.

```env
NEXT_PUBLIC_ENABLE_PAYMENTS=false
```

#### `NEXT_PUBLIC_ENABLE_BOOKING`
Enable/disable class booking functionality.

```env
NEXT_PUBLIC_ENABLE_BOOKING=true
```

---

### Payment Gateway (Optional - Future Use)

#### `RAZORPAY_KEY_ID`
Razorpay API key ID (server-side only).

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

#### `RAZORPAY_KEY_SECRET`
Razorpay API key secret (server-side only, never expose publicly).

```env
RAZORPAY_KEY_SECRET=your_secret_key_here
```

#### `NEXT_PUBLIC_RAZORPAY_KEY_ID`
Razorpay key ID for client-side (public, safe to expose).

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

---

### Docker Configuration

#### `DOCKER_BUILD`
Set to `true` when building for Docker deployment.

```env
DOCKER_BUILD=false
```

---

## 🚀 Setting Up Environment Variables

### For Local Development

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```bash
   code .env.local
   ```

3. Update `MONGODB_URI` with your local or Atlas connection string

4. Restart your development server:
   ```bash
   npm run dev
   ```

---

### For Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `fight-flight-studio`
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

**Required for Production:**
```
MONGODB_URI=mongodb+srv://kkbasandani74_db_user:A2FQMVaIulamBITh@cluster0.1tgizol.mongodb.net/fight-flight-studio?retryWrites=true&w=majority

NEXT_PUBLIC_APP_URL=https://fightandflight.in

NEXT_PUBLIC_SITE_NAME=Fight & Flight Studio

NEXT_PUBLIC_SITE_DESCRIPTION=Bangalore's first and only Muay Thai and Aerial Dance Studio

NEXT_PUBLIC_SOFTGEN_SCRIPT_URL=https://cdn.softgen.ai/script.js

NEXT_PUBLIC_SOFTGEN_EDITOR_URL=https://cdn.softgen.dev/visual-editor.min.js

NEXT_PUBLIC_TESTIMONIAL_IMAGE_1=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop

NEXT_PUBLIC_TESTIMONIAL_IMAGE_2=https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop

NEXT_PUBLIC_TESTIMONIAL_IMAGE_3=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop

NEXT_PUBLIC_ENABLE_PAYMENTS=false

NEXT_PUBLIC_ENABLE_BOOKING=true
```

5. Select environments: **Production**, **Preview**, **Development**
6. Click **Save**
7. Redeploy your application

---

## 🔒 Security Best Practices

### Public vs Private Variables

**Public Variables** (start with `NEXT_PUBLIC_`)
- ✅ Safe to expose in browser
- Used in client-side React components
- Examples: API URLs, feature flags, public keys

**Private Variables** (no prefix)
- ⚠️ Server-side only
- Never exposed to browser
- Examples: Database credentials, API secrets, private keys

### Important Security Rules

1. **Never commit `.env.local`** to git (already in `.gitignore`)
2. **Always use `NEXT_PUBLIC_` prefix** for client-side variables
3. **Keep secrets server-side** (no `NEXT_PUBLIC_` prefix)
4. **Rotate credentials** if accidentally exposed
5. **Use different credentials** for development and production

---

## 🧪 Testing Environment Variables

Test if variables are loaded correctly:

```bash
# In your terminal
npm run dev

# In browser console (F12)
console.log(process.env.NEXT_PUBLIC_APP_URL)
```

---

## 📝 Variable Naming Convention

- Use `SCREAMING_SNAKE_CASE`
- Prefix public variables with `NEXT_PUBLIC_`
- Use descriptive names
- Group related variables

**Good:**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_FEATURE_PAYMENTS=true
DATABASE_CONNECTION_POOL_SIZE=10
```

**Bad:**
```env
url=https://api.example.com
PAYMENT=true
db=10
```

---

## 🆘 Troubleshooting

### Variables not updating?

1. Restart development server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Variables undefined in browser?

- Check variable has `NEXT_PUBLIC_` prefix
- Restart dev server after adding new variables
- Verify variable is in `.env.local`

### Production deployment issues?

- Verify all variables in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables
- Check Vercel deployment logs

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

## ✅ Checklist for Deployment

- [ ] `.env.local` created with all required variables
- [ ] MongoDB Atlas connection string added
- [ ] All `NEXT_PUBLIC_*` variables added to Vercel
- [ ] `MONGODB_URI` added to Vercel (all environments)
- [ ] `NEXT_PUBLIC_APP_URL` updated to production domain
- [ ] Development server tested locally
- [ ] Production deployment successful
- [ ] Website loads with correct configuration

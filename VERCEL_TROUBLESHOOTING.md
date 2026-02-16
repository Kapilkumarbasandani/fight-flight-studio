# Vercel Deployment Troubleshooting

## Issue: Only Text Visible, No Images/Styling

### Root Cause
Vercel is serving the app from `/fight-flight-studio/` subdirectory instead of root, causing 404 errors for assets.

### Fix Steps

#### Option 1: Redeploy with Correct Settings (RECOMMENDED)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project: `fight-flight-studio`

2. **Delete Current Deployment (Optional but Recommended)**
   - Go to Project Settings
   - Scroll to "Delete Project"
   - Confirm deletion

3. **Reimport Project**
   - Click "Add New Project"
   - Import from GitHub: `Kapilkumarbasandani/fight-flight-studio`
   - **IMPORTANT**: When asked for project name, use a simple name like `fightflight` or leave it as suggested
   - Do NOT use the repository name as subdirectory

4. **Configure Environment Variables**
   Before deploying, add:
   - `MONGODB_URI` = your MongoDB Atlas connection string

5. **Deploy**
   - Click "Deploy"
   - Wait for build
   - App should be at: `https://fightflight.vercel.app` or similar

#### Option 2: Fix Current Deployment

If you don't want to delete and recreate:

1. **Go to Project Settings**
   - Find "General" section
   - Look for "Build & Development Settings"

2. **Check Root Directory**
   - Should be blank or `/`
   - If it shows `/fight-flight-studio`, remove it

3. **Framework Preset**
   - Should be "Next.js"
   - Vercel should auto-detect this

4. **Redeploy**
   - Go to "Deployments" tab
   - Click on latest deployment
   - Click three dots (•••)
   - Select "Redeploy"

#### Option 3: Use Custom Domain

If the subdirectory issue persists:

1. Add a custom domain in Vercel Project Settings
2. Configure DNS with your domain provider
3. App will work correctly on custom domain

### Verification

After deployment, check:

1. ✅ Homepage loads with video background
2. ✅ Logo visible in navigation
3. ✅ Images load in Offerings section
4. ✅ Styles applied (neon green/pink colors)
5. ✅ Console shows no 404 errors

### Common Errors and Solutions

**Error**: `Failed to load resource: 404`
- **Cause**: Assets loading from wrong path
- **Fix**: Ensure no `basePath` in Vercel settings

**Error**: `The resource was preloaded using link preload but not used`
- **Cause**: Font preloading warning (harmless)
- **Fix**: Ignore or disable font optimization

**Error**: Only text visible
- **Cause**: CSS not loading
- **Fix**: Check Network tab in browser DevTools for failed CSS requests

### MongoDB Connection

Don't forget to:
1. Set `MONGODB_URI` environment variable
2. Allow all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
3. Use connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Test After Deployment

```bash
# Test API endpoint
curl https://your-app.vercel.app/api/classes

# Should return: [] or array of classes
```

### Need Help?

If issues persist:
1. Share the exact Vercel URL
2. Share console errors from browser DevTools
3. Check Vercel deployment logs for build errors

---

**Quick Fix Command**:
If you have Vercel CLI installed:
```bash
vercel --prod --yes
```
This will deploy directly with correct settings.

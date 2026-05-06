# 🚀 Complete Deployment Guide for fightandflight.in

## Overview
This guide will help you deploy your Fight & Flight Studio website to your GoDaddy domain **fightandflight.in** using Vercel (free hosting).

---

## ✅ Prerequisites Checklist
- [x] Domain purchased: fightandflight.in (GoDaddy)
- [ ] MongoDB Atlas account (free)
- [ ] Vercel account (free)
- [ ] GitHub repository access

---

## 📦 PART 1: MongoDB Atlas Setup (Database - 10 minutes)

### Step 1.1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email (FREE)
3. Choose **FREE M0 cluster**
4. Select a cloud provider (AWS recommended)
5. Choose region closest to India (Mumbai/Singapore)

### Step 1.2: Create Database User
1. In Atlas dashboard, click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. **Username**: `fightflight-admin`
4. **Password**: Click "Autogenerate Secure Password" and **COPY IT** (save in notepad!)
5. **Database User Privileges**: Select "Read and write to any database"
6. Click **"Add User"**

### Step 1.3: Allow Network Access
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"ALLOW ACCESS FROM ANYWHERE"** (important for Vercel!)
4. It will add: `0.0.0.0/0`
5. Click **"Confirm"**

### Step 1.4: Get Your Connection String
1. Click **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://fightflight-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT**: Replace `<password>` with the password you copied in Step 1.2
6. **Save this complete connection string** - you'll need it for Vercel!

---

## 🌐 PART 2: Vercel Deployment (15 minutes)

### Step 2.1: Create Vercel Account & Import Project
1. Go to: https://vercel.com/signup
2. Sign up with **GitHub** (recommended)
3. Once logged in, click **"Add New Project"**
4. Click **"Import Git Repository"**
5. Find your repository: `Kapilkumarbasandani/fight-flight-studio`
6. Click **"Import"**

### Step 2.2: Configure Project Settings
1. **Project Name**: `fight-flight-studio` (or any name)
2. **Framework Preset**: Next.js (should auto-detect)
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: `npm run build` (should auto-fill)
5. **Output Directory**: `.next` (should auto-fill)

### Step 2.3: Add Environment Variables (CRITICAL!)
Before clicking "Deploy", add this environment variable:

1. Click **"Environment Variables"** section (expand it)
2. Add variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Paste your complete MongoDB connection string from Step 1.4
   - Example: `mongodb+srv://fightflight-admin:YourPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
3. Select all environments: **Production, Preview, Development**

### Step 2.4: Deploy!
1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment (you'll see build logs)
3. Once done, you'll see: **"Congratulations! Your project has been deployed"**
4. You'll get a URL like: `https://fight-flight-studio-xxxxx.vercel.app`
5. **Click the URL to test your site!**

---

## 🌍 PART 3: Connect Your GoDaddy Domain (10 minutes)

### Step 3.1: Add Domain to Vercel
1. In Vercel, go to your project
2. Click **"Settings"** tab (top)
3. Click **"Domains"** (left sidebar)
4. Type: `fightandflight.in`
5. Click **"Add"**
6. Also add: `www.fightandflight.in`
7. Click **"Add"**

### Step 3.2: Vercel Will Show DNS Records
Vercel will display something like:
```
Type: A Record
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```
**Keep this page open! You'll need these values.**

### Step 3.3: Update DNS in GoDaddy
1. Go to: https://dcc.godaddy.com/control/portfolio/
2. Find **fightandflight.in**
3. Click **"DNS"** button (or "Manage DNS")
4. Scroll to **"DNS Records"** section

### Step 3.4: Add A Record
1. Click **"Add Record"**
2. **Type**: Select "A"
3. **Name**: Type `@`
4. **Value**: Enter the IP from Vercel (e.g., `76.76.21.21`)
5. **TTL**: 600 seconds (default)
6. Click **"Save"**

### Step 3.5: Add CNAME Record
1. Click **"Add Record"**
2. **Type**: Select "CNAME"
3. **Name**: Type `www`
4. **Value**: Enter `cname.vercel-dns.com`
5. **TTL**: 600 seconds (default)
6. Click **"Save"**

### Step 3.6: Wait for DNS Propagation
- DNS changes take **10 minutes to 48 hours** (usually 15-30 minutes)
- Check status in Vercel under Settings > Domains
- When ready, you'll see a green checkmark ✅

---

## 🎯 PART 4: Initial Setup After Deployment

### Step 4.1: Create Admin User
Once your site is live, you need to create an admin account:

1. Open your terminal in VS Code
2. Update the admin script to use your production MongoDB:
   ```bash
   # Set your MongoDB URI temporarily
   $env:MONGODB_URI="your_mongodb_atlas_connection_string"
   
   # Run the script
   node scripts/create-admin.js
   ```

3. Or manually create admin in MongoDB Atlas:
   - Go to Atlas > Browse Collections
   - Database: `test` (or your DB name)
   - Collection: `users`
   - Insert Document:
   ```json
   {
     "email": "admin@fightandflight.in",
     "name": "Admin",
     "role": "admin",
     "password": "$2a$10$..." (use bcrypt hash),
     "credits": 0,
     "createdAt": new Date()
   }
   ```

### Step 4.2: Test Your Website
1. Go to: `https://fightandflight.in`
2. Test all pages:
   - Home page loads
   - Login/signup works
   - Admin panel accessible
   - Class bookings work

---

## 🔒 Security Checklist

- [ ] Changed admin password from default
- [ ] MongoDB Atlas has network restrictions
- [ ] Environment variables secured in Vercel
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Test all authentication flows

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments: https://vercel.com/dashboard
- View analytics & logs
- Set up custom domains
- Configure environment variables

### MongoDB Atlas
- Monitor database usage: https://cloud.mongodb.com
- View connection logs
- Backup settings (automatic in free tier)

---

## 🆘 Troubleshooting

### Issue: Site shows 500 error
**Solution**: Check MongoDB connection string in Vercel environment variables

### Issue: Domain not working after 24 hours
**Solution**: 
- Verify DNS records in GoDaddy match Vercel's requirements
- Remove old A/CNAME records if any exist
- Try flushing DNS: `ipconfig /flushdns`

### Issue: Can't login as admin
**Solution**: Recreate admin user using the script above

### Issue: Images not loading
**Solution**: Ensure all images are in `/public` folder and paths start with `/`

---

## 📞 Need Help?

### Resources:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- GoDaddy DNS Help: https://www.godaddy.com/help/manage-dns-680

---

## 🎉 Congratulations!

Once complete, your site will be live at:
- **https://fightandflight.in**
- **https://www.fightandflight.in**

Your website is now:
✅ Deployed globally on Vercel's CDN
✅ Connected to secure MongoDB database
✅ Using your custom GoDaddy domain
✅ SSL/HTTPS enabled automatically
✅ Auto-deploys when you push to GitHub

---

## 📝 Quick Reference

**MongoDB Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Vercel DNS Records:**
```
A Record: @ → Vercel IP (from dashboard)
CNAME: www → cname.vercel-dns.com
```

**Important URLs:**
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- GoDaddy DNS: https://dcc.godaddy.com
- Your GitHub: https://github.com/Kapilkumarbasandani/fight-flight-studio

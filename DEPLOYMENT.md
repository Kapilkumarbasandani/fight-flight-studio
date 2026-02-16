# Fight & Flight Studio - Deployment Instructions

## Vercel Deployment

### Prerequisites
1. MongoDB Atlas account (free tier works)
2. Vercel account connected to your GitHub

### Step-by-Step Deployment

1. **MongoDB Atlas Setup**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Whitelist all IPs (0.0.0.0/0) for Vercel deployment

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository: `https://github.com/Kapilkumarbasandani/fight-flight-studio`
   - Configure environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     ```

3. **Environment Variables**
   Add these in Vercel dashboard > Project > Settings > Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string

4. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```

3. Start MongoDB locally (or use MongoDB Atlas)

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Initial Setup Scripts

After deployment, you may need to run these scripts locally to set up initial data:

```bash
# Create admin user
node scripts/create-admin.js

# Populate sample data (optional)
node scripts/populate-sample-data.js
```

### Admin Access

Default admin credentials (change these!):
- Email: admin@fightflight.com
- Password: (set during admin creation)

### Troubleshooting

If you get 404 errors on Vercel:
1. Check that `MONGODB_URI` is set in environment variables
2. Ensure MongoDB Atlas allows connections from all IPs
3. Check Vercel deployment logs for errors
4. Redeploy after fixing any issues

### Features

- ✅ Admin panel for class management
- ✅ User dashboard with booking system
- ✅ Credits management
- ✅ Automatic past class filtering
- ✅ Booking history tracking
- ✅ Hero stats and achievements
- ✅ Forms and waivers

### Tech Stack

- Next.js 15.5.7
- TypeScript
- MongoDB
- Tailwind CSS
- Vercel (hosting)

### Support

For issues, please create a GitHub issue or contact support.

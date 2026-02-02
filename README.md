# Fight & Flight Studio Website

A premium, modern, cinematic website for Fight & Flight Studio - Bangkok's premier Muay Thai & aerial dance movement studio.

## 🥊✨ Brand Essence

Turning ordinary people into superheroes through movement, confidence, joy, and self-belief.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📦 Installation

1. **Install Dependencies:**
```bash
npm install
```

2. **Run Development Server:**
```bash
npm run dev
```

3. **Open in Browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Black (#000000):** Primary backgrounds, headlines
- **Neon Green (#00FF41):** Muay Thai branding, CTAs, energy
- **Electric Pink (#FF10F0):** Aerial dance branding, highlights
- **White (#FFFFFF):** Body copy, clarity

### Typography
- **Headlines:** Bold sans-serif with tight tracking
- **Body:** Clean, modern, highly readable
- **Strong hierarchy:** Clear visual distinction

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── pricing/
│   │   └── page.tsx          # Pricing page
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard
│   ├── book/
│   │   └── page.tsx          # Booking page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Navigation.tsx        # Main navigation
│   ├── Footer.tsx            # Site footer
│   ├── Hero.tsx              # Hero section
│   ├── BrandStory.tsx        # Philosophy section
│   ├── Offerings.tsx         # Muay Thai & Aerial sections
│   ├── Founders.tsx          # Founder profiles
│   ├── Community.tsx         # Testimonials & social
│   ├── CTASection.tsx        # Call-to-action
│   ├── PricingTiers.tsx      # Pricing cards
│   ├── DashboardStats.tsx    # User stats
│   └── BookingCalendar.tsx   # Class booking
├── lib/
│   └── mockData.ts           # Mock data for demo
└── types/
    └── index.ts              # TypeScript types
```

## 🎯 Key Features

### 1. **Home Page**
- Cinematic hero section with "Fight. Fly. Become."
- Brand story and philosophy
- Equal presentation of Muay Thai and Aerial Dance
- Founder profiles
- Community testimonials

### 2. **Pricing System**
Gamified, hero-themed credit tiers:
- 🟢 **The Trainee:** 1 credit (₹850)
- 🟡 **The Sidekick:** 5 credits (₹4,000)
- 🔵 **The Superhero:** 20 credits (₹12,000) - Best Balance
- 🔴 **The Immortal:** 50 credits (₹25,000) - Best Value

### 3. **Booking System**
- Filterable class calendar (discipline, level, instructor)
- Real-time availability
- Credit-based booking
- Booking confirmation flow
- Mobile-first design

### 4. **User Dashboard**
- Credit balance with expiry tracking
- Upcoming classes
- Booking history
- Quick stats

## 🎨 Brand Voice

**Tone:** Empowering • Inclusive • Confident • Playful • Never Intimidating

**Do's:**
- Use active voice
- Short, punchy sentences
- Aspirational but grounded
- Celebrate effort, not just achievement

**Don'ts:**
- Corporate jargon
- Fitness clichés
- Gendered language
- Intimidating or exclusive tone

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 📝 Brand Copy Reference

All website copy is documented in `BRAND_COPY_MASTER.md` including:
- Hero headlines and CTAs
- Brand philosophy
- Offering descriptions
- Founder bios
- UX microcopy
- Email templates
- Error messages

## 🎭 Mock Data

Currently using mock data for demonstration:
- User profile with credit balance
- Class schedule
- Booking history

**To integrate real data:**
1. Replace `src/lib/mockData.ts` with API calls
2. Add authentication system
3. Connect to payment gateway
4. Implement real-time booking management

## 🚀 Deployment

This is a Next.js app and can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS**
- **Any Node.js hosting**

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-optimized interactions
- Optimized for all screen sizes

## ✨ Next Steps

1. **Add Images:**
   - Replace placeholder images with real photos
   - Optimize images for web
   - Add founder headshots
   - Add action shots from classes

2. **Backend Integration:**
   - Set up database (PostgreSQL/MongoDB)
   - Create API endpoints
   - Add authentication (NextAuth.js)
   - Integrate payment gateway (Stripe/Razorpay)

3. **Enhanced Features:**
   - Email notifications
   - SMS reminders
   - Calendar sync
   - Waitlist management
   - Class reviews and ratings

4. **SEO Optimization:**
   - Add meta descriptions
   - Implement structured data
   - Create sitemap
   - Optimize for local search

5. **Analytics:**
   - Google Analytics
   - Conversion tracking
   - User behavior analysis

## 📞 Contact

For questions about this project:
- Email: hello@fightandflightstudio.com
- Instagram: @fightandflightstudio

---

**Built with 💪 and ✨ for Fight & Flight Studio**

*Where superheroes are made.*

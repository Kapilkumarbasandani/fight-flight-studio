# Quick Start Guide - Fight & Flight Studio

## ⚠️ Important: Folder Name Issue

The current folder name "Fight&Flight" contains an ampersand (&) which can cause issues with npm on Windows.

## 🔧 Solution: Rename the Folder

**Option 1: Rename via File Explorer**
1. Close VS Code
2. Navigate to `c:\Personal project\`
3. Rename `Fight&Flight` to `fight-flight-studio`
4. Reopen the renamed folder in VS Code
5. Run the installation commands below

**Option 2: Rename via PowerShell**
```powershell
cd "c:\Personal project\"
Rename-Item "Fight&Flight" "fight-flight-studio"
cd fight-flight-studio
```

## 📦 Installation Steps

After renaming the folder, run these commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Quick Start (After Folder Rename)

1. **Rename the folder** (see above)
2. **Open in VS Code**
3. **Open terminal** (Ctrl + `)
4. **Run:**
   ```bash
   npm install
   npm run dev
   ```
5. **Open browser:** http://localhost:3000

## 📁 Alternative: Create New Project

If you prefer a fresh start with the correct name:

```powershell
# Navigate to parent directory
cd "c:\Personal project\"

# Create new folder with proper name
mkdir fight-flight-studio
cd fight-flight-studio

# Copy all files from Fight&Flight folder to new folder
# Then run:
npm install
npm run dev
```

## ✅ What's Included

Once installed, you'll have:

- ✨ **Home Page** - Hero, brand story, offerings, founders
- 💰 **Pricing Page** - 4 gamified credit tiers
- 📅 **Booking System** - Filterable class calendar
- 📊 **Dashboard** - User stats, credits, bookings
- 🎨 **Full Design System** - Tailwind + custom components
- 📱 **Responsive Design** - Mobile-first

## 🎨 Development URLs

- Home: http://localhost:3000
- Pricing: http://localhost:3000/pricing
- Book: http://localhost:3000/book
- Dashboard: http://localhost:3000/dashboard

## 📝 Next Steps

1. **Replace placeholder images** with real photos
2. **Customize colors** in `tailwind.config.ts`
3. **Add backend integration** for real bookings
4. **Connect payment gateway**
5. **Add authentication**

## 🆘 Troubleshooting

**If npm install still fails:**

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. Reinstall:
   ```bash
   npm install
   ```

**If port 3000 is busy:**
```bash
npm run dev -- -p 3001
```

## 📞 Support

Need help? Check the main README.md for detailed documentation.

---

**Remember:** The folder name must NOT contain special characters like `&` for npm to work properly on Windows!

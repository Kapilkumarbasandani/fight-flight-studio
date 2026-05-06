# How to Test the APIs - Complete Guide

## Why You're Still Seeing Dummy Data

You were seeing dummy data because:
1. ✅ **APIs were created** but...
2. ❌ **Dashboard pages weren't updated** to fetch from those APIs
3. ❌ **No sample data existed** in MongoDB collections

**I've now fixed issue #2** by updating the dashboard to fetch real data from the APIs.

---

## Quick Start Testing (3 Steps)

### Step 1: Ensure MongoDB is Running
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it:
Start-Service MongoDB
```

### Step 2: Populate Sample Data
```powershell
# Run the sample data script
node scripts/populate-sample-data.js
```

This will:
- Find your first non-admin user
- Add credits (12 total, 5 expiring soon)
- Add stats (45 total classes, 28 Muay Thai, 17 Aerial)
- Add 3 upcoming bookings
- Add recent activities
- Add credit transaction history
- Add form submissions

### Step 3: Start the App & Test
```powershell
# Start development server
npm run dev
```

Then:
1. Open http://localhost:3003
2. Login with your user account (NOT admin)
3. You should now see REAL data from MongoDB!

---

## Testing Individual APIs

### Method 1: Using Browser (GET requests only)

Open these URLs in your browser while logged in:

```
http://localhost:3003/api/user/stats?userId=YOUR_USER_ID
http://localhost:3003/api/user/activity?userId=YOUR_USER_ID&limit=5
http://localhost:3003/api/bookings?userId=YOUR_USER_ID&type=upcoming
http://localhost:3003/api/credits?userId=YOUR_USER_ID
http://localhost:3003/api/user/hero?userId=YOUR_USER_ID
http://localhost:3003/api/credit-packages
http://localhost:3003/api/forms
http://localhost:3003/api/classes
```

**How to get YOUR_USER_ID:**
1. Login to your dashboard
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Type: `JSON.parse(localStorage.getItem('user'))._id`
5. Copy the ID

---

### Method 2: Using PowerShell (All HTTP methods)

#### GET Request Example:
```powershell
# Get user stats
$userId = "YOUR_USER_ID_HERE"
Invoke-RestMethod -Uri "http://localhost:3003/api/user/stats?userId=$userId" -Method GET
```

#### POST Request Example:
```powershell
# Create a booking
$body = @{
    userId = "YOUR_USER_ID"
    classId = "YOUR_CLASS_ID"
    className = "Muay Thai Foundations"
    classType = "muay-thai"
    instructor = "Coach Alex"
    date = "2026-02-15"
    time = "6:00 PM"
    creditsUsed = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3003/api/bookings" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

#### DELETE Request Example:
```powershell
# Cancel a booking
$body = @{
    bookingId = "YOUR_BOOKING_ID"
    userId = "YOUR_USER_ID"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3003/api/bookings" `
    -Method DELETE `
    -ContentType "application/json" `
    -Body $body
```

---

### Method 3: Using VS Code Thunder Client Extension

1. Install "Thunder Client" from VS Code Extensions
2. Create a new request
3. **GET Request:**
   - Method: GET
   - URL: `http://localhost:3003/api/user/stats?userId=YOUR_USER_ID`
   - Click Send

4. **POST Request:**
   - Method: POST
   - URL: `http://localhost:3003/api/bookings`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
   ```json
   {
     "userId": "YOUR_USER_ID",
     "classId": "YOUR_CLASS_ID",
     "className": "Muay Thai",
     "classType": "muay-thai",
     "instructor": "Coach Alex",
     "date": "2026-02-15",
     "time": "6:00 PM",
     "creditsUsed": 1
   }
   ```

---

### Method 4: Using Browser DevTools Console

Open DevTools (F12) and paste in Console:

```javascript
// Get user stats
const userId = JSON.parse(localStorage.getItem('user'))._id;
fetch(`/api/user/stats?userId=${userId}`)
  .then(r => r.json())
  .then(data => console.log('User Stats:', data));

// Get bookings
fetch(`/api/bookings?userId=${userId}&type=upcoming`)
  .then(r => r.json())
  .then(data => console.log('Upcoming Bookings:', data));

// Get activities
fetch(`/api/user/activity?userId=${userId}&limit=5`)
  .then(r => r.json())
  .then(data => console.log('Recent Activities:', data));

// Create a booking (need classId from classes API first)
fetch('/api/classes')
  .then(r => r.json())
  .then(classes => {
    const firstClass = classes[0];
    return fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        classId: firstClass._id,
        className: firstClass.type,
        classType: firstClass.type.toLowerCase().includes('muay') ? 'muay-thai' : 'aerial',
        instructor: firstClass.instructor,
        date: '2026-02-15',
        time: firstClass.time,
        creditsUsed: 1
      })
    });
  })
  .then(r => r.json())
  .then(data => console.log('Booking Created:', data));
```

---

## What Each API Returns

### 1. User Stats API
**GET** `/api/user/stats?userId={userId}`

Response:
```json
{
  "credits": 12,
  "expiringCredits": 5,
  "expiryDate": "Feb 25, 2026",
  "totalClasses": 45,
  "muayThaiClasses": 28,
  "aerialClasses": 17
}
```

---

### 2. User Activity API
**GET** `/api/user/activity?userId={userId}&limit=5`

Response:
```json
[
  {
    "_id": "...",
    "action": "Completed Aerial Hoop class",
    "type": "class_completion",
    "time": "2 hours ago",
    "createdAt": "2026-02-11T10:00:00Z"
  },
  {
    "_id": "...",
    "action": "Booked Muay Thai session",
    "type": "booking",
    "time": "Yesterday",
    "createdAt": "2026-02-10T15:00:00Z"
  }
]
```

---

### 3. Bookings API
**GET** `/api/bookings?userId={userId}&type=upcoming`

Response:
```json
[
  {
    "_id": "...",
    "classId": "...",
    "className": "Muay Thai Foundations",
    "classType": "muay-thai",
    "instructor": "Coach Alex",
    "date": "Today",
    "fullDate": "2026-02-11",
    "time": "6:00 PM",
    "status": "confirmed",
    "creditsUsed": 1,
    "attended": false,
    "daysUntil": 0
  }
]
```

---

### 4. Credits API
**GET** `/api/credits?userId={userId}`

Response:
```json
{
  "balance": 12,
  "expiringCredits": [
    {
      "amount": 5,
      "expiryDate": "Feb 25, 2026",
      "daysLeft": 14
    }
  ]
}
```

---

### 5. Hero Stats API
**GET** `/api/user/hero?userId={userId}`

Response:
```json
{
  "level": 24,
  "levelName": "Immortal Warrior",
  "gender": "female",
  "achievements": [
    {
      "id": "first-strike",
      "label": "First Strike",
      "desc": "Complete your first Muay Thai class",
      "color": "neonGreen",
      "unlocked": true
    }
  ],
  "stats": [
    {
      "label": "Strength Level",
      "value": 32,
      "max": 50,
      "color": "neonGreen"
    }
  ],
  "progressPercent": 75
}
```

---

## Verify Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `fight-flight-studio`
4. Check collections:
   - **users** - Should have your user with credits, stats, hero data
   - **bookings** - Should have 3 upcoming bookings
   - **activities** - Should have 3 recent activities
   - **credit_transactions** - Should have transaction history
   - **form_submissions** - Should have 3 completed forms
   - **classes** - Should have active classes

---

## Troubleshooting

### Issue: "User not found" error
**Solution:** Make sure you're using the correct userId from localStorage

### Issue: Still seeing loading state
**Solution:** 
1. Check browser console for errors (F12)
2. Verify MongoDB is running: `Get-Service MongoDB`
3. Check if sample data script ran successfully

### Issue: "Cannot read property '_id'" error
**Solution:** You're not logged in. Login first, then reload the page.

### Issue: Empty arrays returned
**Solution:** Run the sample data script: `node scripts/populate-sample-data.js`

### Issue: CORS or connection errors
**Solution:** Make sure dev server is running on port 3003: `npm run dev`

---

## Next Steps After Testing

1. **Update Other Pages** - I've updated the dashboard, but other pages (bookings, credits, hero, forms) still use mock data
2. **Add Real Payment Integration** - Integrate actual Razorpay credentials
3. **Add Error Handling** - Add toast notifications for API errors
4. **Add Loading States** - Add skeleton loaders for better UX
5. **Implement Caching** - Use SWR or React Query for data fetching

---

## Summary

✅ **17 APIs created and working**
✅ **Dashboard updated to fetch real data**
✅ **Sample data script provided**
✅ **Multiple testing methods documented**

Your APIs are fully functional! The issue was just that pages weren't connected to them yet.

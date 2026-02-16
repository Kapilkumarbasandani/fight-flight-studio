# Fight & Flight Studio - API Documentation

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js 15.5.7 (Pages Router with API Routes)
- **Language**: TypeScript
- **Database**: MongoDB (Local - MongoDB Compass)
- **Database Driver**: mongodb native driver
- **Authentication**: bcryptjs (password hashing) + localStorage (session management)

### Frontend
- **Framework**: Next.js 15.5.7 with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Payment Integration (Ready for Integration)
- **Gateway**: Razorpay (API scaffolding created, needs credentials)

---

## API Endpoints

### 1. Authentication APIs

#### POST /api/auth/signup
- **Purpose**: Register new user
- **Request Body**: `{ name, email, whatsapp, password }`
- **Response**: User object without password
- **Database**: Creates user in `users` collection

#### POST /api/auth/signin
- **Purpose**: User login (accepts email or username)
- **Request Body**: `{ email, password }` (email field accepts username too)
- **Response**: User object without password
- **Database**: Queries `users` collection

---

### 2. User Profile & Stats APIs

#### GET /api/user/profile?userId={userId}
- **Purpose**: Get user profile data
- **Response**: User profile including address, birthday, etc.
- **Database**: `users` collection

#### PUT /api/user/profile
- **Purpose**: Update user profile
- **Request Body**: `{ userId, profile: { address, birthday } }`
- **Response**: Success message
- **Database**: Updates `users` collection

#### GET /api/user/stats?userId={userId}
- **Purpose**: Get user dashboard statistics
- **Response**: 
  ```json
  {
    "credits": 12,
    "expiringCredits": 5,
    "expiryDate": "Feb 10, 2026",
    "totalClasses": 45,
    "muayThaiClasses": 28,
    "aerialClasses": 17
  }
  ```
- **Database**: `users` collection
- **Used In**: Dashboard main page

#### GET /api/user/activity?userId={userId}&limit={limit}
- **Purpose**: Get recent user activity feed
- **Response**: Array of activities with relative timestamps
- **Database**: `activities` collection
- **Used In**: Dashboard main page

#### GET /api/user/hero?userId={userId}
- **Purpose**: Get hero stats, level, and achievements
- **Response**: 
  ```json
  {
    "level": 24,
    "levelName": "Immortal Warrior",
    "gender": "female",
    "achievements": [...],
    "stats": [
      { "label": "Strength Level", "value": 32, "max": 50, "color": "neonGreen" },
      ...
    ],
    "progressPercent": 75
  }
  ```
- **Database**: `users` collection
- **Used In**: Hero Stats page

---

### 3. Class Management APIs

#### GET /api/classes
- **Purpose**: Get all active classes (public endpoint)
- **Response**: Array of class objects
- **Database**: `classes` collection (filters `active: true`)
- **Used In**: Schedule page (all users)

#### GET /api/admin/classes (Admin Only)
- **Purpose**: Get all classes including inactive
- **Response**: Array of all classes
- **Database**: `classes` collection
- **Used In**: Admin class management

#### POST /api/admin/classes (Admin Only)
- **Purpose**: Create new class
- **Request Body**: Class data (type, instructor, day, time, etc.)
- **Database**: Inserts into `classes` collection

#### PUT /api/admin/classes (Admin Only)
- **Purpose**: Update existing class
- **Request Body**: `{ classId, ...classData }`
- **Database**: Updates `classes` collection

#### DELETE /api/admin/classes (Admin Only)
- **Purpose**: Delete a class
- **Request Body**: `{ classId }`
- **Database**: Deletes from `classes` collection

---

### 4. Booking APIs

#### GET /api/bookings?userId={userId}&type={type}
- **Purpose**: Get user bookings
- **Query Params**: 
  - `type`: 'all' | 'upcoming' | 'past'
- **Response**: Array of bookings with formatted dates
- **Database**: `bookings` collection
- **Used In**: Bookings page, Dashboard upcoming classes

#### POST /api/bookings
- **Purpose**: Create new class booking
- **Request Body**: 
  ```json
  {
    "userId": "...",
    "classId": "...",
    "className": "Muay Thai Foundations",
    "classType": "muay-thai",
    "instructor": "Coach Alex",
    "date": "2026-02-12",
    "time": "6:00 PM",
    "creditsUsed": 1
  }
  ```
- **Response**: Created booking object
- **Database Actions**:
  - Inserts into `bookings` collection
  - Deducts credits from `users.credits.balance`
  - Creates transaction in `credit_transactions`
  - Logs activity in `activities` collection
- **Business Logic**: 
  - Checks class capacity
  - Sets status to 'waitlist' if full
  - Only charges credits if confirmed

#### DELETE /api/bookings
- **Purpose**: Cancel a booking
- **Request Body**: `{ bookingId, userId }`
- **Response**: Success message
- **Database Actions**:
  - Updates booking status to 'cancelled'
  - Refunds credits to user
  - Creates refund transaction
  - Logs activity

---

### 5. Credits & Payment APIs

#### GET /api/credits?userId={userId}
- **Purpose**: Get user credit balance and expiring credits
- **Response**: 
  ```json
  {
    "balance": 12,
    "expiringCredits": [
      { "amount": 5, "expiryDate": "Feb 15, 2026", "daysLeft": 12 }
    ]
  }
  ```
- **Database**: `users.credits` subdocument
- **Used In**: Credits page, Dashboard

#### GET /api/credit-packages
- **Purpose**: Get available credit packages
- **Response**: Array of packages
  ```json
  [
    {
      "id": "10-pack",
      "credits": 10,
      "price": 220,
      "perClass": 22,
      "popular": true,
      "validityDays": 120
    }
  ]
  ```
- **Database**: Static configuration (can be moved to DB)
- **Used In**: Credits page

#### GET /api/credits/history?userId={userId}&limit={limit}
- **Purpose**: Get credit transaction history
- **Response**: Array of credit transactions
- **Database**: `credit_transactions` collection
- **Used In**: Credits page history section

#### POST /api/payments/create-order
- **Purpose**: Create Razorpay payment order
- **Request Body**: `{ userId, packageId, credits, price }`
- **Response**: Order details with orderId
- **Notes**: Currently returns mock data. To integrate Razorpay:
  1. Install: `npm install razorpay`
  2. Add env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
  3. Uncomment Razorpay code in file
- **Used In**: Credits purchase flow

#### POST /api/payments/verify
- **Purpose**: Verify Razorpay payment and add credits
- **Request Body**: 
  ```json
  {
    "userId": "...",
    "orderId": "...",
    "paymentId": "...",
    "packageId": "10-pack",
    "credits": 10,
    "validityDays": 120
  }
  ```
- **Response**: `{ success: true, newBalance: 22 }`
- **Database Actions**:
  - Updates `users.credits.balance`
  - Adds expiring credit entry
  - Creates transaction in `credit_transactions`
  - Logs activity
- **Notes**: Currently skips signature verification. Uncomment code for production.

---

### 6. Forms & Waivers APIs

#### GET /api/forms
- **Purpose**: Get list of available forms
- **Response**: Array of form definitions
- **Database**: Static configuration
- **Used In**: Forms page

#### GET /api/forms/submissions?userId={userId}
- **Purpose**: Get user's form submission status
- **Response**: 
  ```json
  {
    "forms": [
      {
        "id": "waiver",
        "title": "Member Waiver",
        "required": true,
        "status": "completed",
        "date": "Submitted on Jan 10, 2026",
        "submissionId": "..."
      }
    ],
    "allRequiredCompleted": true
  }
  ```
- **Database**: `form_submissions` collection + `users.formsCompleted`
- **Used In**: Forms page

#### POST /api/forms/submissions
- **Purpose**: Submit a form
- **Request Body**: 
  ```json
  {
    "userId": "...",
    "formId": "waiver",
    "formData": { ... },
    "signature": "data:image/png;base64,..."
  }
  ```
- **Response**: Created submission object
- **Database Actions**:
  - Inserts into `form_submissions` collection
  - Adds formId to `users.formsCompleted` array
  - Logs activity

---

## MongoDB Collections

### 1. users
**Purpose**: Store user accounts and data
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  whatsapp: String,
  password: String (bcrypt hashed),
  createdAt: Date,
  profile: {
    address: String,
    birthday: String,
    gender: 'male' | 'female' | 'other'
  },
  credits: {
    balance: Number,
    expiringCredits: [
      { amount: Number, expiryDate: Date }
    ]
  },
  stats: {
    totalClasses: Number,
    muayThaiClasses: Number,
    aerialClasses: Number,
    strength: Number,
    agility: Number,
    endurance: Number,
    flexibility: Number
  },
  hero: {
    level: Number,
    levelName: String,
    achievements: [String]
  },
  membership: {
    type: String,
    startDate: Date,
    endDate: Date
  },
  formsCompleted: [String],
  role: 'user' | 'admin'
}
```

### 2. classes
**Purpose**: Store class schedule and information
```javascript
{
  _id: ObjectId,
  type: String,
  instructor: String,
  day: String,
  time: String,
  capacity: Number,
  active: Boolean,
  creditsRequired: Number,
  bookedCount: Number
}
```

### 3. bookings
**Purpose**: Store class bookings
```javascript
{
  _id: ObjectId,
  userId: String,
  classId: String,
  className: String,
  classType: String,
  instructor: String,
  date: String (YYYY-MM-DD),
  time: String,
  status: 'confirmed' | 'waitlist' | 'cancelled',
  creditsUsed: Number,
  createdAt: Date,
  attended: Boolean
}
```

### 4. credit_transactions
**Purpose**: Store credit purchase and usage history
```javascript
{
  _id: ObjectId,
  userId: String,
  type: 'credit' | 'debit',
  amount: Number,
  description: String,
  balanceAfter: Number,
  createdAt: Date,
  expiryDate: Date (optional),
  invoiceUrl: String (optional),
  orderId: String (optional),
  paymentId: String (optional)
}
```

### 5. activities
**Purpose**: Store user activity feed
```javascript
{
  _id: ObjectId,
  userId: String,
  action: String,
  type: 'booking' | 'purchase' | 'class_completion' | 'achievement' | 'other',
  createdAt: Date,
  metadata: Object (optional)
}
```

### 6. form_submissions
**Purpose**: Store user form submissions
```javascript
{
  _id: ObjectId,
  userId: String,
  formId: String,
  formData: Object,
  signature: String (optional),
  submittedAt: Date
}
```

---

## Data Models (TypeScript Interfaces)

Located in `src/models/`:

1. **User.ts** - User and UserResponse interfaces
2. **Class.ts** - Class and ClassResponse interfaces
3. **Booking.ts** - Booking and BookingResponse interfaces
4. **CreditTransaction.ts** - CreditTransaction, CreditTransactionResponse, CreditPackage interfaces
5. **Activity.ts** - Activity and ActivityResponse interfaces
6. **Form.ts** - Form, FormSubmission, FormSubmissionResponse interfaces

---

## Environment Variables

Required in `.env.local`:

```bash
MONGODB_URI=mongodb://localhost:27017/fight-flight-studio

# For Razorpay Integration (Optional)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

---

## How to Use These APIs

### Frontend Integration Example:

```typescript
// Get user stats
const fetchUserStats = async (userId: string) => {
  const response = await fetch(`/api/user/stats?userId=${userId}`);
  const data = await response.json();
  return data;
};

// Create booking
const createBooking = async (bookingData: any) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  return await response.json();
};

// Purchase credits (with Razorpay)
const purchaseCredits = async (packageData: any) => {
  // Step 1: Create order
  const order = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packageData)
  }).then(r => r.json());

  // Step 2: Open Razorpay checkout (when integrated)
  // const rzp = new Razorpay({ key: 'your_key', ...order });
  // rzp.open();

  // Step 3: Verify payment
  const verification = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...order, paymentId: 'pay_xxx' })
  }).then(r => r.json());

  return verification;
};
```

---

## Next Steps for Production

### 1. Razorpay Integration
- Install package: `npm install razorpay`
- Add environment variables
- Uncomment Razorpay code in:
  - `/api/payments/create-order.ts`
  - `/api/payments/verify.ts`
- Test with Razorpay test credentials

### 2. Authentication Enhancement
- Consider adding JWT tokens instead of localStorage
- Add refresh token mechanism
- Implement session expiry

### 3. API Security
- Add API middleware for authentication
- Rate limiting
- Input validation and sanitization
- CORS configuration for production

### 4. Database Indexing
Add indexes for better performance:
```javascript
db.bookings.createIndex({ userId: 1, date: -1 });
db.credit_transactions.createIndex({ userId: 1, createdAt: -1 });
db.activities.createIndex({ userId: 1, createdAt: -1 });
```

### 5. File Upload
- Implement actual file upload for form signatures
- Use cloud storage (AWS S3, Cloudinary, etc.)
- Generate and store PDF invoices

---

## API Testing

You can test these APIs using:
- **Postman** or **Insomnia**
- **Thunder Client** (VS Code extension)
- Browser DevTools
- `curl` commands

Example curl test:
```bash
# Get user stats
curl "http://localhost:3003/api/user/stats?userId=YOUR_USER_ID"

# Create booking
curl -X POST "http://localhost:3003/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"userId":"...","classId":"...","className":"Muay Thai",...}'
```

---

**Total APIs Created: 17 endpoints** ✅
**Database Collections: 6 collections** ✅
**TypeScript Models: 6 model files** ✅

# Fight & Flight Studio - API Quick Reference

## Tech Stack Summary

**Backend**: Next.js 15.5.7 (API Routes) + TypeScript + MongoDB + bcryptjs  
**Frontend**: Next.js + React + TypeScript + Tailwind CSS + shadcn/ui  
**Database**: MongoDB (Local via MongoDB Compass)  
**Payment**: Razorpay (scaffolding ready, needs credentials to activate)

---

## Complete API List (17 Endpoints)

### Authentication (2 APIs)
1. `POST /api/auth/signup` - Register new user
2. `POST /api/auth/signin` - User login

### User Profile & Stats (5 APIs)
3. `GET /api/user/profile` - Get user profile
4. `PUT /api/user/profile` - Update user profile
5. `GET /api/user/stats` - Dashboard statistics
6. `GET /api/user/activity` - Recent activity feed
7. `GET /api/user/hero` - Hero stats & achievements

### Classes (5 APIs)
8. `GET /api/classes` - Public class schedule
9. `GET /api/admin/classes` - Admin: Get all classes
10. `POST /api/admin/classes` - Admin: Create class
11. `PUT /api/admin/classes` - Admin: Update class
12. `DELETE /api/admin/classes` - Admin: Delete class

### Bookings (3 APIs)
13. `GET /api/bookings` - Get user bookings
14. `POST /api/bookings` - Create booking
15. `DELETE /api/bookings` - Cancel booking

### Credits & Payments (5 APIs)
16. `GET /api/credits` - Credit balance
17. `GET /api/credit-packages` - Available packages
18. `GET /api/credits/history` - Transaction history
19. `POST /api/payments/create-order` - Create Razorpay order
20. `POST /api/payments/verify` - Verify payment & add credits

### Forms (2 APIs)
21. `GET /api/forms` - Available forms list
22. `GET /api/forms/submissions` - User submissions
23. `POST /api/forms/submissions` - Submit form

---

## MongoDB Collections (6 Collections)

1. **users** - User accounts, credits, stats, hero data
2. **classes** - Class schedule and details
3. **bookings** - User class bookings
4. **credit_transactions** - Credit purchase/usage history
5. **activities** - User activity feed
6. **form_submissions** - Form submission data

---

## Data Models (6 TypeScript Files)

Located in `src/models/`:
1. **User.ts** - User & UserResponse
2. **Class.ts** - Class & ClassResponse
3. **Booking.ts** - Booking & BookingResponse
4. **CreditTransaction.ts** - CreditTransaction, CreditTransactionResponse, CreditPackage
5. **Activity.ts** - Activity & ActivityResponse
6. **Form.ts** - Form, FormSubmission, FormSubmissionResponse

---

## API Usage by Page

### Dashboard (`/app/index`)
- `GET /api/user/stats` - Credits, class counts
- `GET /api/bookings?type=upcoming` - Upcoming classes
- `GET /api/user/activity` - Recent activity

### Bookings Page (`/app/bookings`)
- `GET /api/bookings?type=upcoming` - Upcoming bookings
- `GET /api/bookings?type=past` - Past bookings
- `DELETE /api/bookings` - Cancel booking

### Schedule Page (`/app/schedule`)
- `GET /api/classes` - Active classes
- `POST /api/bookings` - Book a class

### Credits Page (`/app/credits`)
- `GET /api/credits` - Current balance
- `GET /api/credit-packages` - Packages to purchase
- `GET /api/credits/history` - Transaction history
- `POST /api/payments/create-order` - Start purchase
- `POST /api/payments/verify` - Complete purchase

### Hero Stats Page (`/app/hero`)
- `GET /api/user/hero` - Level, achievements, stats

### Profile Page (`/app/profile`)
- `GET /api/user/profile` - User profile data
- `PUT /api/user/profile` - Update profile

### Forms Page (`/app/forms`)
- `GET /api/forms/submissions` - Form status
- `POST /api/forms/submissions` - Submit form

### Admin Classes (`/admin/classes`)
- `GET /api/admin/classes` - All classes
- `POST /api/admin/classes` - Create class
- `PUT /api/admin/classes` - Update class
- `DELETE /api/admin/classes` - Delete class

---

**For detailed API documentation, see `API_DOCUMENTATION.md`**

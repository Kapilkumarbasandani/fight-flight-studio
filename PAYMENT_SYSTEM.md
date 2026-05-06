# Payment System Documentation

## Overview

The Fight&Flight Studio uses a **UPI-based payment verification system** for credit purchases. This document explains the payment flow and API endpoints.

## Payment Flow

### 1. User Initiates Payment
- User selects a credit pack from `/app/buy-credits`
- System creates a payment record with status `pending`
- User receives UPI payment details (UPI ID and QR code)

### 2. User Makes Payment
- User transfers money via UPI to the studio's UPI ID
- User receives a transaction ID from their payment app
- User submits the transaction ID in the application

### 3. Admin Verification
- Payment status changes to `submitted` after user enters transaction ID
- Admin reviews payment in `/admin/payments`
- Admin verifies the transaction in their payment app
- **Only after admin verification**, credits are added to user account

### 4. Credits Added
- On verification, payment status becomes `verified`
- Credits are automatically added to user's account
- Credit expiry date is set (90 days from purchase)
- User can now book classes using these credits

## API Endpoints

### Initiate Payment
**POST** `/api/payments/initiate`

```json
{
  "userId": "user_id",
  "amount": 1500,
  "credits": 10,
  "packName": "Sidekick Pack",
  "paymentMethod": "UPI"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "payment_id",
  "paymentInfo": {
    "upiId": "fightflight@paytm",
    "qrCodeUrl": "/images/payment-qr.png",
    "amount": 1500,
    "note": "Credits purchase - 10 credits"
  }
}
```

### Submit Payment Proof
**POST** `/api/payments/submit`

```json
{
  "paymentId": "payment_id",
  "transactionId": "123456789012",
  "upiId": "user@paytm"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment submitted successfully. Admin will verify and credits will be added."
}
```

### Get Payments (Admin Only)
**GET** `/api/admin/payments?userRole=admin&status=submitted`

Returns list of payments filtered by status:
- `all` - All payments
- `pending` - Awaiting user submission
- `submitted` - Awaiting admin verification
- `verified` - Verified and credits added
- `rejected` - Payment rejected

### Verify/Reject Payment (Admin Only)
**PUT** `/api/admin/payments/[id]?userRole=admin&userId=admin_id`

```json
{
  "action": "verify",
  "notes": "Payment verified via phone bank"
}
```

## Payment Statuses

1. **pending** - Payment initiated, awaiting user payment
2. **submitted** - User submitted transaction ID, awaiting admin verification
3. **verified** - Admin verified payment, credits added
4. **rejected** - Admin rejected payment (invalid transaction)

## Credit System Integration

### Booking Classes
- Users must have sufficient credits to book classes
- API checks `credits.balance` before allowing booking
- Returns error if insufficient credits
- Credits are deducted only for confirmed bookings

### Credit Expiry
- Credits expire 90 days after purchase
- Tracked in `expiringCredits` array with purchase and expiry dates
- Admin can pause expiry for individual users

## Configuration

### Update Payment Details

1. **UPI ID**: Update in `/api/payments/initiate.ts`
   ```typescript
   upiId: 'your-upi-id@bank'
   ```

2. **QR Code**: Upload QR code image to `/public/images/payment-qr.png`

3. **Credit Packs**: Update in `/app/buy-credits.tsx`
   ```typescript
   const creditPacks = [
     { name: "Pack Name", credits: 10, price: 1500 }
   ];
   ```

## Security Features

- Admin-only access to payment verification
- User authentication required for payment initiation
- Transaction IDs stored for audit trail
- All payments tracked in database
- Credit balance verification before booking

## Admin Dashboard

Navigate to `/admin/payments` to:
- View all payment transactions
- Filter by status (pending, submitted, verified, rejected)
- View payment details (user, amount, transaction ID)
- Verify or reject payments
- Add notes to payment records

## Testing Payment Flow

1. Login as regular user
2. Navigate to Buy Credits page
3. Select a credit pack
4. Copy UPI ID and make actual payment
5. Enter transaction ID received from payment app
6. Login as admin
7. Verify payment in admin dashboard
8. Check user account - credits should be added
9. Try booking a class with the new credits

## Important Notes

- **Credits are NOT added until admin verification**
- Users cannot book classes without verified credits
- Always verify transaction ID matches the payment amount
- Keep record of all transaction IDs for disputes
- Credits expire 90 days after purchase (tracked automatically)

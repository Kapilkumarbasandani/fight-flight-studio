# Payment System Setup Guide

## Quick Setup Steps

### 1. Update UPI ID

Open `src/pages/api/payments/initiate.ts` and update line 42:

```typescript
upiId: 'your-actual-upi-id@bank', // ⬅️ Change this
```

Replace `'fightflight@paytm'` with your actual UPI ID.

### 2. Add QR Code Image

1. Generate your UPI payment QR code from your payment app
2. Save the QR code image as `payment-qr.png`
3. Place it in: `public/images/payment-qr.png`

If you don't have a `/public/images/` folder, create it.

### 3. Update Credit Packs (Optional)

To modify credit packs and pricing, edit `src/pages/app/buy-credits.tsx` line 15:

```typescript
const creditPacks: CreditPack[] = [
  {
    name: "Trainee Pack",
    credits: 5,
    price: 750,  // ⬅️ Update prices
  },
  {
    name: "Sidekick Pack",
    credits: 10,
    price: 1500,
  },
  // Add more packs as needed
];
```

### 4. Admin Access

Admin can verify payments at: `http://localhost:3001/admin/payments`

**Admin Login:**
- Email: `Admin`
- Password: `Qwerty@123`

### 5. User Flow

Users can buy credits at: `http://localhost:3001/app/buy-credits`

## Payment Verification Workflow

### For Users:
1. Go to "Buy Credits" page
2. Select a credit pack
3. Make payment via UPI (scan QR or use UPI ID)
4. Enter transaction ID received from payment app
5. Wait for admin verification
6. Credits will be added after verification

### For Admin:
1. Go to Admin Dashboard → Payment Verification
2. Click "Submitted" tab to see pending payments
3. Verify transaction ID in your bank/payment app
4. Click ✓ to verify (adds credits) or ✗ to reject
5. Optionally add notes

## Testing

1. **Test Payment Flow:**
   - Login as user
   - Buy smallest pack (₹750)
   - Make actual payment
   - Submit transaction ID
   - Verify as admin
   - Check credits in user account

2. **Test Booking:**
   - After credits added, try booking a class
   - Should deduct credits successfully

## Important Notes

⚠️ **Credits are only added after admin verification**
⚠️ **Users cannot book without verified credits**
⚠️ **Always verify transaction ID matches amount**
⚠️ **Credits expire in 90 days**

## Troubleshooting

**Issue:** QR code not showing
- **Fix:** Check if image exists at `public/images/payment-qr.png`

**Issue:** Payment not appearing in admin dashboard
- **Fix:** Check MongoDB connection and payments collection

**Issue:** Credits not added after verification
- **Fix:** Check console logs for errors in browser developer tools

## Security Checklist

✅ Updated UPI ID with your actual ID
✅ Added payment QR code
✅ Tested payment flow end-to-end
✅ Admin password is secure
✅ MongoDB is properly configured

## Next Steps

1. Update UPI ID and QR code
2. Test with small amount first
3. Verify credits are added correctly
4. Test class booking with credits
5. Train admin on payment verification process

For detailed documentation, see `PAYMENT_SYSTEM.md`

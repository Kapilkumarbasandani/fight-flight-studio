# Payment System Setup Checklist

## ☑️ Pre-Setup Checklist

- [ ] MongoDB is running (`mongod` service active)
- [ ] Development server is running (`npm run dev`)
- [ ] Admin account exists (username: `Admin`, password: `Qwerty@123`)
- [ ] You have your UPI ID for receiving payments
- [ ] You have a UPI QR code image

## ☑️ Configuration Steps

### Step 1: Update UPI ID
- [ ] Open `src/pages/api/payments/initiate.ts`
- [ ] Find line 42: `upiId: 'fightflight@paytm'`
- [ ] Replace with your actual UPI ID
- [ ] Save file

### Step 2: Add QR Code
- [ ] Create folder `public/images/` (if doesn't exist)
- [ ] Save your QR code as `payment-qr.png`
- [ ] Place in `public/images/payment-qr.png`
- [ ] Verify file path is correct

### Step 3: Restart Server
- [ ] Stop the development server (Ctrl+C)
- [ ] Run `npm run dev` again
- [ ] Check for any errors in terminal

## ☑️ Testing Checklist

### Test as User
- [ ] Navigate to `http://localhost:3001`
- [ ] Login as regular user (not admin)
- [ ] Go to "Buy Credits" or `/app/buy-credits`
- [ ] Select smallest pack (₹750)
- [ ] Verify UPI ID is correct
- [ ] Make actual payment via UPI
- [ ] Copy transaction ID from payment app
- [ ] Submit transaction ID in form
- [ ] See success message

### Test as Admin
- [ ] Logout from user account
- [ ] Login as admin (Email: `Admin`, Password: `Qwerty@123`)
- [ ] Go to Admin Dashboard
- [ ] Check "Pending Payments" card shows count: 1
- [ ] Click on "Payment Verification" or go to `/admin/payments`
- [ ] Click "Submitted" tab
- [ ] See your payment in the list
- [ ] Click eye icon to view details
- [ ] Verify transaction ID matches
- [ ] Click "Verify & Add Credits" button
- [ ] See success message

### Verify Credits Added
- [ ] Logout from admin
- [ ] Login as user again
- [ ] Check credits balance in dashboard
- [ ] Credits should be increased by pack amount
- [ ] Try booking a class
- [ ] Class booking should work
- [ ] Credits should be deducted

## ☑️ Production Readiness

### Security
- [ ] Changed admin password from default
- [ ] UPI ID is correct and active
- [ ] MongoDB is secured (not using default ports in production)
- [ ] Environment variables are set properly

### Functionality
- [ ] All credit packs are priced correctly
- [ ] QR code displays properly
- [ ] Payment submission works
- [ ] Admin verification works
- [ ] Credits are added correctly
- [ ] Credit expiry is 90 days (or your preferred duration)

### User Experience
- [ ] Payment instructions are clear
- [ ] QR code is high quality and scannable
- [ ] Transaction ID format is explained
- [ ] Success/error messages are helpful

### Admin Experience
- [ ] Admin can access payment management
- [ ] Payment filters work (all, submitted, verified, rejected)
- [ ] Payment details modal shows all information
- [ ] Verify/reject actions work
- [ ] Admin dashboard shows pending count

## ☑️ Documentation Review

- [ ] Read `PAYMENT_SYSTEM.md` - Complete documentation
- [ ] Read `PAYMENT_SETUP.md` - Setup guide
- [ ] Read `PAYMENT_IMPLEMENTATION.md` - What was built
- [ ] Understand payment flow
- [ ] Know how to verify payments
- [ ] Know how to handle disputes

## ☑️ Training Checklist

### For Admin Staff
- [ ] Show how to access payment management
- [ ] Explain verification process
- [ ] Train on checking transaction IDs
- [ ] Explain verify vs reject
- [ ] Show how to add notes
- [ ] Explain credit expiry system

### For Users
- [ ] Announce new payment system
- [ ] Provide QR code separately if needed
- [ ] Explain transaction ID submission
- [ ] Explain verification timeline (24 hours)
- [ ] Provide support contact

## ☑️ Monitoring Checklist

### Daily Tasks
- [ ] Check pending payments
- [ ] Verify submitted payments
- [ ] Process any disputes
- [ ] Monitor revenue dashboard

### Weekly Tasks
- [ ] Review all verified payments
- [ ] Check for any rejected payments
- [ ] Analyze payment patterns
- [ ] Review credit usage

## ☑️ Troubleshooting Completed

- [ ] Tested what happens with wrong transaction ID
- [ ] Tested payment rejection flow
- [ ] Tested with different credit packs
- [ ] Tested booking after credit addition
- [ ] Tested insufficient credit scenario
- [ ] Checked all error messages

## 🎯 Final Verification

- [ ] **Payment system is fully functional**
- [ ] **Admin can verify payments**
- [ ] **Credits are added correctly**
- [ ] **Users can book classes with credits**
- [ ] **Revenue tracking is accurate**
- [ ] **All test data removed from admin dashboard**

---

## ✅ System Ready for Production!

Once all checkboxes are ticked, your payment system is ready to accept real payments.

**Need Help?**
- Check `PAYMENT_SYSTEM.md` for detailed documentation
- Review `PAYMENT_SETUP.md` for configuration help
- See `PAYMENT_IMPLEMENTATION.md` for technical details

**Support:**
If you encounter issues:
1. Check browser console for errors
2. Check server terminal for errors
3. Verify MongoDB connection
4. Verify UPI ID is correct
5. Ensure QR code image exists

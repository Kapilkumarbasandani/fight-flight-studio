# MongoDB Setup Instructions

## Prerequisites
You need MongoDB installed on your local machine.

## Installation

### Windows
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. MongoDB Compass should be installed automatically (GUI for MongoDB)

### Alternative: Using MongoDB Compass Directly
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install and open MongoDB Compass
3. Connect to: `mongodb://localhost:27017`

## Starting MongoDB

### Windows
MongoDB should start automatically as a service after installation.

To start manually:
```powershell
net start MongoDB
```

To check if it's running:
```powershell
Get-Service MongoDB
```

## Database Configuration

The application will automatically create a database called `fight-flight-studio` when you sign up your first user.

### Collections Created:
- `users` - Stores user registration data (name, email, whatsapp, hashed password)

## Environment Variables

The `.env.local` file has been created with:
```
MONGODB_URI=mongodb://localhost:27017/fight-flight-studio
```

## Testing the Integration

1. Make sure MongoDB is running
2. Start your Next.js dev server: `npm run dev`
3. Click "JOIN NOW" button
4. Fill out the signup form
5. Check MongoDB Compass to see your data:
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Find database: `fight-flight-studio`
   - View collection: `users`

## Features Implemented

✅ User Sign Up with MongoDB storage
✅ Password hashing with bcrypt
✅ User Sign In with password verification
✅ Email uniqueness validation
✅ Form validation
✅ Success/Error messages
✅ Loading states

## User Data Stored

When a user signs up, the following data is saved:
- Name
- Email (unique, lowercase)
- WhatsApp Number
- Password (hashed)
- Created At timestamp

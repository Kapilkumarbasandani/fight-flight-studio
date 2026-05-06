# Authentication Setup Instructions

## MongoDB Compass Setup

1. **Install MongoDB Compass** (if not already installed)
   - Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Install and launch the application

2. **Connect to MongoDB**
   - Open MongoDB Compass
   - Use your existing connection details
   - Click "Connect" or "New Connection"
   - Enter your connection string or connection details

3. **Create Database**
   - After connecting, click "Create Database"
   - Database Name: `fight-flight-studio`
   - Collection Name: `users`
   - Click "Create Database"

4. **Get Connection String**
   - In MongoDB Compass, your connection string is shown at the top
   - It typically looks like:
     - Local: `mongodb://localhost:27017`
     - With auth: `mongodb://username:password@localhost:27017`
     - Remote: `mongodb://host:port` or `mongodb+srv://...`

5. **Add to Environment Variables**
   - Create a `.env.local` file in the root directory
   - Add your connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/fight-flight-studio
   ```
   - Or if you have authentication:
   ```
   MONGODB_URI=mongodb://username:password@localhost:27017/fight-flight-studio
   ```

## Testing the Authentication

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Click "JOIN NOW" button** on the navigation

3. **Sign Up**
   - Fill in the registration form
   - Click "Sign Up"
   - You should see a success message

4. **Sign In**
   - After signup, you'll be switched to the sign-in form
   - Enter your credentials
   - Click "Sign In"
   - You'll be redirected to the dashboard at `/app`

## Files Created

- **Frontend:**
  - `src/components/AuthModal.tsx` - Authentication modal component
  - Updated `src/components/Navigation.tsx` - Added auth integration

- **Backend:**
  - `src/lib/mongodb.ts` - MongoDB connection utility
  - `src/models/User.ts` - User type definitions
  - `src/pages/api/auth/signup.ts` - User registration endpoint
  - `src/pages/api/auth/signin.ts` - User login endpoint

- **Configuration:**
  - `.env.local.example` - Environment variables template

## User Features

- **Sign Up:** Create new account with name, email, WhatsApp, password
- **Sign In:** Login with email and password
- **User Session:** Stored in localStorage
- **Protected Routes:** Dashboard at `/app` accessible after login
- **User Profile:** Name displayed in navigation when logged in
- **Logout:** Clear session and redirect to homepage

## Database Schema

Users collection includes:
- `name`: User's full name
- `email`: User's email (unique, lowercase)
- `whatsapp`: WhatsApp number
- `password`: Bcrypt hashed password
- `role`: 'user' or 'admin'
- `createdAt`: Account creation timestamp
- `membership`: Optional membership details

## Security Notes

- Passwords are hashed using bcryptjs with 10 salt rounds
- Email validation on both frontend and backend
- Password minimum length: 6 characters
- User data (except password) stored in localStorage for session management

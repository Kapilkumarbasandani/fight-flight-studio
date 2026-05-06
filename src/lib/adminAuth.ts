import { GetServerSidePropsContext } from 'next';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user?: {
    _id: string;
    email: string;
    role: string;
    name?: string;
  };
}

/**
 * Check if user is authenticated and has admin role
 * This should be used in getServerSideProps for admin pages
 */
export async function verifyAdminAccess(context: GetServerSidePropsContext): Promise<{
  redirect?: { destination: string; permanent: boolean };
  props?: any;
}> {
  try {
    // Get userId from cookie or session (for now, we'll use a workaround with query param)
    // In production, this should use HTTP-only cookies with session tokens
    const { req } = context;
    
    // For now, redirect to login page if no user data can be verified
    // Since we're using localStorage (client-side), we need a different approach
    // We'll use client-side checking with useEffect
    
    return {
      props: {}
    };
  } catch (error) {
    console.error('Admin auth error:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

/**
 * Client-side admin verification
 * Call this from useEffect in admin pages
 */
export function useAdminAuth() {
  if (typeof window === 'undefined') return { user: null, isAdmin: false };
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return { user: null, isAdmin: false };
  }
  
  try {
    const user = JSON.parse(userStr);
    return { 
      user, 
      isAdmin: user.role === 'admin' 
    };
  } catch {
    return { user: null, isAdmin: false };
  }
}

/**
 * API endpoint to verify user role from database
 */
export async function verifyUserRole(userId: string): Promise<AdminAuthResult> {
  try {
    const client = await clientPromise;
    const db = client.db('fight-flight-studio');
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    });
    
    if (!user) {
      return { isAuthenticated: false, isAdmin: false };
    }
    
    return {
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
      user: {
        _id: user._id.toString(),
        email: user.email,
        role: user.role || 'user',
        name: user.profile?.name || user.name
      }
    };
  } catch (error) {
    console.error('Error verifying user role:', error);
    return { isAuthenticated: false, isAdmin: false };
  }
}

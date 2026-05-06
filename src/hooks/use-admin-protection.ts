import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
}

interface UseAdminProtectionResult {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

/**
 * Custom hook to protect admin pages
 * Verifies user authentication and admin role from database
 * Redirects non-admin users to home page
 */
export function useAdminProtection(): UseAdminProtectionResult {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
          // No user logged in, redirect to home
          router.replace('/');
          return;
        }

        const userData = JSON.parse(storedUser);
        
        // Verify with backend that this user is actually an admin
        const response = await fetch(`/api/auth/verify-admin?userId=${userData._id}`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();

        if (!result.isAdmin) {
          // User is not an admin, redirect to their dashboard
          console.warn('Access denied: User is not an admin');
          router.replace('/app');
          return;
        }

        // User is verified as admin
        setUser(userData);
        setIsAdmin(true);
      } catch (error) {
        console.error('Error verifying admin access:', error);
        // On error, redirect to home for safety
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [router]);

  return { user, loading, isAdmin };
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUserRole } from '@/lib/adminAuth';

/**
 * API endpoint to verify if a user has admin access
 * GET /api/auth/verify-admin?userId=xxx
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ 
        error: 'User ID is required',
        isAdmin: false 
      });
    }

    const authResult = await verifyUserRole(userId);

    if (!authResult.isAuthenticated) {
      return res.status(401).json({ 
        error: 'User not found',
        isAdmin: false 
      });
    }

    return res.status(200).json({
      isAdmin: authResult.isAdmin,
      user: authResult.user
    });
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      isAdmin: false 
    });
  }
}

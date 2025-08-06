import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAndUpdateExpiredMemberships } from '~/lib/membership-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check and update expired memberships
    await checkAndUpdateExpiredMemberships();
    
    res.status(200).json({ 
      success: true, 
      message: 'Expired memberships checked and updated successfully' 
    });
  } catch (error) {
    console.error('Error checking expired memberships:', error);
    res.status(500).json({ 
      error: 'Failed to check expired memberships',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
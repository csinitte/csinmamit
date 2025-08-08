import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminFirestore } from '~/server/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getAdminFirestore();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('membershipEndDate', '!=', null).get();

    const now = new Date();
    let updated = 0;
    const batch = db.batch();

    snapshot.forEach((docSnap) => {
      const userData = docSnap.data() as Record<string, unknown>;
      const membershipEndDateRaw = userData.membershipEndDate as FirebaseFirestore.Timestamp | Date | undefined;
      const membershipEndDate = membershipEndDateRaw
        ? membershipEndDateRaw instanceof Date
          ? membershipEndDateRaw
          : membershipEndDateRaw.toDate()
        : undefined;

      if (membershipEndDate && now > membershipEndDate && userData.role === 'EXECUTIVE MEMBER') {
        batch.update(docSnap.ref, {
          role: 'User',
          membershipExpired: true,
          membershipExpiredDate: now,
          updatedAt: now,
        });
        updated += 1;
      }
    });

    if (updated > 0) {
      await batch.commit();
    }

    return res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error('Error checking expired memberships (admin):', error);
    return res.status(500).json({ error: 'Failed to check expired memberships' });
  }
}



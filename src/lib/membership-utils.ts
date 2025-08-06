import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export interface MembershipData {
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    paymentDate: Date;
  };
  role: string;
  csiIdNumber?: string; // Optional CSI ID number for Executive Members and Core Team
}

export interface RecruitData {
  id: string;
  name: string;
  personalEmail: string;
  membershipPlan: string;
  csiIdea: string;
  dateOfBirth: Date;
  usn: string;
  yearOfStudy: string;
  branch: string;
  mobileNumber: string;
  collegeEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get membership duration in months based on plan
 */
export const getMembershipDuration = (plan: string): number => {
  switch (plan.toLowerCase()) {
    case 'annual':
    case 'yearly':
      return 12;
    case 'semester':
    case '6 months':
      return 6;
    case 'quarterly':
    case '3 months':
      return 3;
    case 'monthly':
      return 1;
    default:
      return 12; // Default to annual
  }
};

/**
 * Calculate membership end date based on plan
 */
export const calculateMembershipEndDate = (plan: string): Date => {
  const duration = getMembershipDuration(plan);
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);
  return endDate;
};

/**
 * Update user role and membership data after successful payment
 */
export const updateUserMembership = async (
  userId: string, 
  recruitData: RecruitData, 
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
  }
): Promise<void> => {
  try {
    const membershipStartDate = new Date();
    const membershipEndDate = calculateMembershipEndDate(recruitData.membershipPlan);
    
    const membershipData: MembershipData = {
      membershipType: recruitData.membershipPlan,
      membershipStartDate,
      membershipEndDate,
      paymentDetails: {
        ...paymentDetails,
        paymentDate: new Date(),
      },
      role: "EXECUTIVE MEMBER",
    };

    // Update user document with membership data
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...membershipData,
      updatedAt: new Date(),
    });

    console.log(`Membership updated successfully for user ${userId}`);
  } catch (error) {
    console.error('Error updating user membership:', error);
    throw error;
  }
};

/**
 * Get user's recruit data by email
 */
export const getUserRecruitData = async (email: string): Promise<RecruitData | null> => {
  try {
    // Query recruits collection by email
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const recruitsRef = collection(db, 'recruits');
    const q = query(recruitsRef, where('personalEmail', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      if (!doc) return null;
      return {
        id: doc.id,
        ...doc.data()
      } as RecruitData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user recruit data:', error);
    return null;
  }
};

/**
 * Check if user's membership is active
 */
export const isMembershipActive = (membershipEndDate: Date): boolean => {
  const now = new Date();
  return now < membershipEndDate;
};

/**
 * Get membership status message
 */
export const getMembershipStatusMessage = (
  membershipData: MembershipData | null,
  recruitData: RecruitData | null
): string => {
  if (!membershipData) {
    if (recruitData) {
      return `Application submitted for ${recruitData.membershipPlan} membership. Payment pending.`;
    }
    return "No membership found. Join CSI to become a member!";
  }

  if (isMembershipActive(membershipData.membershipEndDate)) {
    const daysLeft = Math.ceil((membershipData.membershipEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return `Active ${membershipData.membershipType} member. ${daysLeft} days remaining.`;
  } else {
    return `Membership expired on ${membershipData.membershipEndDate.toLocaleDateString()}. Renew to continue benefits.`;
  }
};

/**
 * Get membership badge color based on status
 */
export const getMembershipBadgeColor = (
  membershipData: MembershipData | null,
  recruitData: RecruitData | null
): string => {
  if (!membershipData) {
    if (recruitData) {
      return "bg-yellow-100 text-yellow-800"; // Pending payment
    }
    return "bg-gray-100 text-gray-800"; // No membership
  }

  if (isMembershipActive(membershipData.membershipEndDate)) {
    return "bg-green-100 text-green-800"; // Active
  } else {
    return "bg-red-100 text-red-800"; // Expired
  }
}; 

/**
 * Check and update expired memberships
 * This function should be called periodically (e.g., daily via cron job)
 */
export const checkAndUpdateExpiredMemberships = async (): Promise<void> => {
  try {
    const { collection, query, where, getDocs, updateDoc } = await import("firebase/firestore");
    const usersRef = collection(db, 'users');
    
    // Get all users with membership data
    const q = query(usersRef, where('membershipEndDate', '!=', null));
    const querySnapshot = await getDocs(q);
    
    const now = new Date();
    const expiredUsers: string[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as Record<string, unknown>;
      const membershipEndDateRaw = userData.membershipEndDate as { toDate?: () => Date } | Date | undefined;
      const membershipEndDate = membershipEndDateRaw 
        ? (typeof membershipEndDateRaw === 'object' && membershipEndDateRaw !== null && 'toDate' in membershipEndDateRaw && typeof membershipEndDateRaw.toDate === 'function'
            ? membershipEndDateRaw.toDate() 
            : new Date(membershipEndDateRaw as Date))
        : null;
      
      if (membershipEndDate && now > membershipEndDate && userData.role === "EXECUTIVE MEMBER") {
        expiredUsers.push(doc.id);
      }
    });
    
    // Update expired memberships
    for (const userId of expiredUsers) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: "User",
        membershipExpired: true,
        membershipExpiredDate: now,
        updatedAt: now,
      });
      console.log(`Membership expired for user ${userId}`);
    }
    
    console.log(`Updated ${expiredUsers.length} expired memberships`);
  } catch (error) {
    console.error('Error checking expired memberships:', error);
    throw error;
  }
};

/**
 * Generate a unique CSI ID number
 * Format: CSI + Year + 3-digit sequence number
 */
export const generateCsiIdNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
  return `CSI${currentYear}${timestamp}`;
};

/**
 * Get user's membership status for display
 */
export const getUserMembershipStatus = async (userId: string): Promise<{
  isActive: boolean;
  membershipType: string | null;
  daysRemaining: number | null;
  role: string;
}> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { isActive: false, membershipType: null, daysRemaining: null, role: "User" };
    }
    
    const userData = userDoc.data() as Record<string, unknown>;
    const role = (userData.role as string) ?? "User";
    
    if (!userData.membershipEndDate) {
      return { isActive: false, membershipType: null, daysRemaining: null, role };
    }
    
    const membershipEndDateRaw = userData.membershipEndDate as { toDate?: () => Date } | Date;
    const membershipEndDate = typeof membershipEndDateRaw === 'object' && membershipEndDateRaw !== null && 'toDate' in membershipEndDateRaw && typeof membershipEndDateRaw.toDate === 'function'
      ? membershipEndDateRaw.toDate() 
      : new Date(membershipEndDateRaw as Date);
    const isActive = isMembershipActive(membershipEndDate);
    const daysRemaining = isActive 
      ? Math.ceil((membershipEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    return {
      isActive,
      membershipType: (userData.membershipType as string) ?? null,
      daysRemaining,
      role,
    };
  } catch (error) {
    console.error('Error getting user membership status:', error);
    return { isActive: false, membershipType: null, daysRemaining: null, role: "User" };
  }
}; 
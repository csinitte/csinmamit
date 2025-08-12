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
  csiIdNumber?: string;
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

export const getMembershipDuration = (plan: string): number => {
  switch (plan.toLowerCase()) {
    case "annual":
    case "yearly":
      return 12;
    case "semester":
    case "6 months":
      return 6;
    case "quarterly":
    case "3 months":
      return 3;
    case "monthly":
      return 1;
    default:
      return 12;
  }
};

export const calculateMembershipEndDate = (plan: string): Date => {
  const duration = getMembershipDuration(plan);
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);
  return endDate;
};

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

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...membershipData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user membership:", error);
    throw error;
  }
};

export const getUserRecruitData = async (email: string): Promise<RecruitData | null> => {
  try {
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const recruitsRef = collection(db, "recruits");
    const q = query(recruitsRef, where("personalEmail", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      if (!docSnap) return null;
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as RecruitData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user recruit data:", error);
    return null;
  }
};

export const isMembershipActive = (membershipEndDate: Date): boolean => {
  const now = new Date();
  return now < membershipEndDate;
};

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
    const daysLeft = Math.ceil(
      (membershipData.membershipEndDate.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return `Active ${membershipData.membershipType} member. ${daysLeft} days remaining.`;
  } else {
    return `Membership expired on ${membershipData.membershipEndDate.toLocaleDateString()}. Renew to continue benefits.`;
  }
};

export const getMembershipBadgeColor = (
  membershipData: MembershipData | null,
  recruitData: RecruitData | null
): string => {
  if (!membershipData) {
    if (recruitData) {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-gray-100 text-gray-800";
  }

  if (isMembershipActive(membershipData.membershipEndDate)) {
    return "bg-green-100 text-green-800";
  } else {
    return "bg-red-100 text-red-800";
  }
};

export const checkAndUpdateExpiredMemberships = async (): Promise<void> => {
  try {
    const { collection, query, where, getDocs, updateDoc } = await import("firebase/firestore");
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("membershipEndDate", "!=", null));
    const querySnapshot = await getDocs(q);

    const now = new Date();
    const expiredUsers: string[] = [];

    querySnapshot.forEach((docSnap) => {
      const userData = docSnap.data() as Record<string, unknown>;
      const membershipEndDateRaw = userData.membershipEndDate as
        | { toDate?: () => Date }
        | Date
        | undefined;
      const membershipEndDate = membershipEndDateRaw
        ? typeof membershipEndDateRaw === "object" &&
          membershipEndDateRaw !== null &&
          "toDate" in membershipEndDateRaw &&
          typeof (membershipEndDateRaw as { toDate: () => Date }).toDate === "function"
          ? (membershipEndDateRaw as { toDate: () => Date }).toDate()
          : new Date(membershipEndDateRaw as Date)
        : null;

      if (
        membershipEndDate &&
        now > membershipEndDate &&
        userData.role === "EXECUTIVE MEMBER"
      ) {
        expiredUsers.push(docSnap.id);
      }
    });

    for (const userId of expiredUsers) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: "User",
        membershipExpired: true,
        membershipExpiredDate: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.error("Error checking expired memberships:", error);
    throw error;
  }
};

export const generateCsiIdNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-3);
  return `CSI${currentYear}${timestamp}`;
};

export const getUserMembershipStatus = async (
  userId: string
): Promise<{
  isActive: boolean;
  membershipType: string | null;
  daysRemaining: number | null;
  role: string;
}> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      return {
        isActive: false,
        membershipType: null,
        daysRemaining: null,
        role: "User",
      };
    }

    const userData = userDoc.data() as Record<string, unknown>;
    const role = (userData.role as string) ?? "User";

    if (!userData.membershipEndDate) {
      return { isActive: false, membershipType: null, daysRemaining: null, role };
    }

    const membershipEndDateRaw = userData.membershipEndDate as
      | { toDate?: () => Date }
      | Date;
    const membershipEndDate =
      typeof membershipEndDateRaw === "object" &&
      membershipEndDateRaw !== null &&
      "toDate" in membershipEndDateRaw &&
      typeof (membershipEndDateRaw as { toDate: () => Date }).toDate === "function"
        ? (membershipEndDateRaw as { toDate: () => Date }).toDate()
        : new Date(membershipEndDateRaw as Date);
    const isActive = isMembershipActive(membershipEndDate);
    const daysRemaining = isActive
      ? Math.ceil(
          (membershipEndDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      isActive,
      membershipType: (userData.membershipType as string) ?? null,
      daysRemaining,
      role,
    };
  } catch (error) {
    console.error("Error getting user membership status:", error);
    return {
      isActive: false,
      membershipType: null,
      daysRemaining: null,
      role: "User",
    };
  }
};



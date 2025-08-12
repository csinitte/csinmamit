import { type GetServerSidePropsContext } from "next";
import { getAdminAuth, isFirebaseAdminConfigured } from "./firebase-admin";

/**
 * Firebase Auth helper functions
 */
export const verifyFirebaseToken = async (token: string) => {
  try {
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      console.warn('Firebase Admin not properly configured. Token verification skipped.');
      return null;
    }
    
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
};

export const getFirebaseUser = async (uid: string) => {
  try {
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      console.warn('Firebase Admin not properly configured. User fetch skipped.');
      return null;
    }
    
    const auth = getAdminAuth();
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error getting Firebase user:', error);
    return null;
  }
};

/**
 * Wrapper for getting server session with Firebase Auth
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // Extract token from Authorization header or cookies
  const authHeader = ctx.req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') ?? ctx.req.cookies['firebase-token'];
  
  if (!token) {
    return null;
  }

  const decodedToken = await verifyFirebaseToken(token);
  if (!decodedToken) {
    return null;
  }

  const userRecord = await getFirebaseUser(decodedToken.uid);
  if (!userRecord) {
    return null;
  }

  return {
    user: {
      id: userRecord.uid,
      name: userRecord.displayName,
      email: userRecord.email,
      image: userRecord.photoURL,
    },
    expires: new Date(decodedToken.exp * 1000).toISOString(),
  };
};

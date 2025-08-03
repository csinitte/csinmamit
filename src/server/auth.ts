import { type GetServerSidePropsContext } from "next";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * Firebase Auth helper functions
 */
export const verifyFirebaseToken = async (token: string) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
};

export const getFirebaseUser = async (uid: string) => {
  try {
    const userRecord = await getAuth().getUser(uid);
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
  const token = authHeader?.replace('Bearer ', '') || ctx.req.cookies['firebase-token'];
  
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

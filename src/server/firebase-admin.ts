import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

/**
 * Initialize Firebase Admin SDK with proper error handling
 */
export function initializeFirebaseAdmin(): App {
  // Return existing app if already initialized
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized by another module
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0]!;
    return adminApp;
  }

  try {
    // Get environment variables with fallbacks
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // Validate required credentials
    if (!projectId) {
      throw new Error(
        'Firebase Admin: Missing project ID. Please set FIREBASE_ADMIN_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable.'
      );
    }

    if (!clientEmail) {
      throw new Error(
        'Firebase Admin: Missing client email. Please set FIREBASE_ADMIN_CLIENT_EMAIL environment variable.'
      );
    }

    if (!privateKey) {
      throw new Error(
        'Firebase Admin: Missing private key. Please set FIREBASE_ADMIN_PRIVATE_KEY environment variable.'
      );
    }

    // Initialize Firebase Admin
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log('Firebase Admin initialized successfully');
    return adminApp;

  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    
    // For development, we can try to initialize without credentials for read-only operations
    if (process.env.NODE_ENV === 'development') {
      console.warn('Attempting to initialize Firebase Admin without credentials (development mode)');
      try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        if (projectId) {
          adminApp = initializeApp({
            projectId,
          });
          console.warn('Firebase Admin initialized in limited mode (no authentication)');
          return adminApp;
        }
      } catch (devError) {
        console.error('Failed to initialize Firebase Admin in development mode:', devError);
      }
    }
    
    throw error;
  }
}

/**
 * Get Firebase Admin Auth instance
 */
export function getAdminAuth() {
  const app = initializeFirebaseAdmin();
  return getAuth(app);
}

/**
 * Get Firebase Admin Firestore instance
 */
export function getAdminFirestore() {
  const app = initializeFirebaseAdmin();
  return getFirestore(app);
}

/**
 * Check if Firebase Admin is properly configured
 */
export function isFirebaseAdminConfigured(): boolean {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    
    return !!(projectId && clientEmail && privateKey);
  } catch {
    return false;
  }
}

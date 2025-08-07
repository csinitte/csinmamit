import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

// Export Firebase Admin services
export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();

// Helper function to get admin Firestore instance
export const getAdminFirestore = () => {
  if (getApps().length === 0) {
    throw new Error('Firebase Admin not initialized');
  }
  return getFirestore();
};

// Helper function to get admin Auth instance
export const getAdminAuth = () => {
  if (getApps().length === 0) {
    throw new Error('Firebase Admin not initialized');
  }
  return getAuth();
};

// Helper function to get admin Storage instance
export const getAdminStorage = () => {
  if (getApps().length === 0) {
    throw new Error('Firebase Admin not initialized');
  }
  return getStorage();
};

// Export as named export instead of default export
export const firebaseAdmin = {
  adminDb,
  adminAuth,
  adminStorage,
  getAdminFirestore,
  getAdminAuth,
  getAdminStorage,
}; 
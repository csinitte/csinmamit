// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAk2_7JwdE_d61ftYvOcSlbPnuUsJmv44Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "csi-database-1598a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "csi-database-1598a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "csi-database-1598a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "382924608138",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:382924608138:web:b250f9d3f616666ce09373",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NQDQVLSZT6"
};

// Initialize Firebase only if it hasn't been initialized already
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


// Initialize Firebase services
export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;

export default firebaseApp;

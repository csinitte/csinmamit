import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Add a certificate URL to a user's certificates array
 * @param userId - The user's ID
 * @param certificateUrl - The URL of the certificate image
 */
export const addCertificateToUser = async (userId: string, certificateUrl: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      certificates: arrayUnion(certificateUrl),
      updatedAt: new Date()
    });
    
    console.log(`Certificate added successfully to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error adding certificate to user:', error);
    throw error;
  }
};

/**
 * Remove a certificate URL from a user's certificates array
 * @param userId - The user's ID
 * @param certificateUrl - The URL of the certificate to remove
 */
export const removeCertificateFromUser = async (userId: string, certificateUrl: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      certificates: arrayRemove(certificateUrl),
      updatedAt: new Date()
    });
    
    console.log(`Certificate removed successfully from user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error removing certificate from user:', error);
    throw error;
  }
};

/**
 * Replace all certificates for a user
 * @param userId - The user's ID
 * @param certificateUrls - Array of certificate URLs
 */
export const setUserCertificates = async (userId: string, certificateUrls: string[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      certificates: certificateUrls,
      updatedAt: new Date()
    });
    
    console.log(`Certificates updated successfully for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating certificates for user:', error);
    throw error;
  }
};

/**
 * Get all certificates for a user
 * @param userId - The user's ID
 */
export const getUserCertificates = async (userId: string) => {
  try {
    const { getDoc } = await import("firebase/firestore");
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return (data?.certificates as string[]) ?? [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user certificates:', error);
    throw error;
  }
}; 
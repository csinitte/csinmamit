// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWMC0Dyt3rcFT-1uUJvvpoCpWrRz1ALVs",
  authDomain: "amy-sensei-2d90c.firebaseapp.com",
  databaseURL:
    "https://amy-sensei-2d90c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "amy-sensei-2d90c",
  storageBucket: "amy-sensei-2d90c.appspot.com",
  messagingSenderId: "719169834756",
  appId: "1:719169834756:web:d11e54da2570b805e8ca51",
  measurementId: "G-HQ2XY24V82",
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);

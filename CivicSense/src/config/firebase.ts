// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDehz3nsDoGWR1bog9ZBvhqiGbi5YqN8sQ",
  authDomain: "civicsense-07.firebaseapp.com",
  projectId: "civicsense-07",
  storageBucket: "civicsense-07.firebasestorage.app",
  messagingSenderId: "602436072823",
  appId: "1:602436072823:web:525bbbd675a33dbcb5dd72",
  measurementId: "G-DMY3G94MZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Debug: Log active project ID to console
console.log('🔥 Initialized Firebase Project:', firebaseConfig.projectId);

export default app; 
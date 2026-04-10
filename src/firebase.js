import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration - use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAkCgPKPoJIv3jiQi9P-A7PowAb3JaJXBo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "devops-8080b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "devops-8080b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "devops-8080b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "172050486333",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:172050486333:web:253a761f8608e6c9fb4654",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8YT30ZLHKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (optional, only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
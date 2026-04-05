import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkCgPKPoJIv3jiQi9P-A7PowAb3JaJXBo",
  authDomain: "devops-8080b.firebaseapp.com",
  projectId: "devops-8080b",
  storageBucket: "devops-8080b.firebasestorage.app",
  messagingSenderId: "172050486333",
  appId: "1:172050486333:web:253a761f8608e6c9fb4654",
  measurementId: "G-8YT30ZLHKF"
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